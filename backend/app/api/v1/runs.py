import uuid
from datetime import datetime, timezone
from typing import List, Optional, AsyncGenerator
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
import json

from backend.app.core.database import get_db, async_session_maker
from backend.app.models.run import Run
from backend.app.models.cms import Lab
from backend.app.models.quota import Quota
from backend.app.models.user import User
from backend.app.models.enums import RunStatus, RunErrorCode, ExecutionMode
from backend.app.schemas.runs import RunCreateRequest, RunResponse
from backend.app.api.deps import get_current_user
from backend.app.engines import dispatcher
from backend.app.core.redis_client import publish_run_event, subscribe_to_run_events
from backend.app.core.security import sanitize_json

router = APIRouter(prefix="/runs", tags=["Lab Runs"])

async def execute_run_in_background(run_id: uuid.UUID, lab_slug: str, params: dict, user_id: uuid.UUID):
    """
    Background worker task decoupling heavy ML/training workloads from HTTP requests.
    Updates DB state and publishes Redis telemetry.
    """
    async with async_session_maker() as db:
        # Load run record
        stmt = select(Run).where(Run.id == run_id)
        res = await db.execute(stmt)
        run_record = res.scalar_one_or_none()
        if not run_record:
            return

        run_record.status = RunStatus.RUNNING
        run_record.started_at = datetime.now(timezone.utc)
        await db.commit()

        await publish_run_event(str(run_id), {
            "event_type": "status_change",
            "status": "RUNNING",
            "message": f"Execution started on background worker for lab '{lab_slug}'."
        })

        try:
            execution_result = await dispatcher.dispatch_lab_execution(lab_slug, params)
            exec_duration = execution_result["execution_time_sec"]

            run_record.finished_at = datetime.now(timezone.utc)
            if execution_result["success"]:
                run_record.status = RunStatus.SUCCEEDED
                run_record.metrics = sanitize_json(execution_result["metrics"])
                run_record.artifacts = sanitize_json(execution_result["artifacts"])
                run_record.resource_usage = sanitize_json({
                    "cpu_seconds": exec_duration,
                    "memory_mb": 128.0
                })

                # Update user quota
                q_stmt = select(Quota).where(Quota.user_id == user_id)
                q_res = await db.execute(q_stmt)
                quota = q_res.scalar_one_or_none()
                if quota:
                    quota.cpu_seconds_used += exec_duration

                await publish_run_event(str(run_id), {
                    "event_type": "status_change",
                    "status": "SUCCEEDED",
                    "metrics": run_record.metrics,
                    "duration_sec": exec_duration
                })
            else:
                run_record.status = RunStatus.FAILED
                run_record.error_code = RunErrorCode.INTERNAL
                run_record.error_message = execution_result.get("error", "Engine execution failed")
                await publish_run_event(str(run_id), {
                    "event_type": "status_change",
                    "status": "FAILED",
                    "error": run_record.error_message
                })

        except Exception as e:
            run_record.status = RunStatus.FAILED
            run_record.error_code = RunErrorCode.INTERNAL
            run_record.error_message = str(e)
            run_record.finished_at = datetime.now(timezone.utc)
            await publish_run_event(str(run_id), {
                "event_type": "status_change",
                "status": "FAILED",
                "error": str(e)
            })

        await db.commit()

@router.post("", response_model=RunResponse, status_code=status.HTTP_201_CREATED)
async def create_run(
    req: RunCreateRequest,
    wait: bool = Query(True, description="Wait for execution to complete synchronously, or queue to background worker"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Execute or queue an interactive lab computational run:
    - Verifies lab registration and user quota
    - If wait=False: Enqueues to async background worker and returns HTTP 201/202 with status=QUEUED
    - If wait=True: Executes computation synchronously and returns completed run metrics
    - Telemetry streamed to Redis Pub/Sub for live observation
    """
    # 1. Fetch Lab Definition
    stmt = select(Lab).where(Lab.id == req.lab_id)
    res = await db.execute(stmt)
    lab = res.scalar_one_or_none()
    if not lab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Lab {req.lab_id} not found")

    # 2. Check User Quota
    stmt_quota = select(Quota).where(Quota.user_id == current_user.id)
    res_quota = await db.execute(stmt_quota)
    quota = res_quota.scalar_one_or_none()
    if quota and quota.cpu_seconds_used >= quota.cpu_seconds_budget:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="User CPU quota exceeded. Please wait for reset or request higher tier."
        )

    # 3. Check Hardware Constraints
    actual_mode = req.execution_mode
    if req.execution_mode == ExecutionMode.GPU_REAL:
        import torch
        if not torch.cuda.is_available() and not torch.backends.mps.is_available():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="GPU-real mode is not available on this worker host. Please select CPU-real mode."
            )

    # 4. Check Idempotency Key
    if req.idempotency_key:
        stmt_idemp = select(Run).where(and_(Run.user_id == current_user.id, Run.idempotency_key == req.idempotency_key))
        res_idemp = await db.execute(stmt_idemp)
        existing_run = res_idemp.scalar_one_or_none()
        if existing_run:
            return existing_run

    trace_id = f"trace_{uuid.uuid4().hex[:16]}"

    # 5. Create Run Record in QUEUED state
    run_record = Run(
        user_id=current_user.id,
        lab_id=lab.id,
        lab_version=req.lab_version,
        execution_mode=actual_mode,
        params=req.params,
        seed=req.seed,
        status=RunStatus.QUEUED,
        metrics={},
        artifacts={},
        resource_usage={"cpu_seconds": 0.0, "memory_mb": 0.0},
        error_code=RunErrorCode.NONE,
        trace_id=trace_id,
        idempotency_key=req.idempotency_key,
        created_at=datetime.now(timezone.utc)
    )
    db.add(run_record)
    await db.commit()
    await db.refresh(run_record)

    # 6. Execute based on wait flag
    if not wait:
        # OPS-01 & OPS-007: Enqueue to Redis worker queue + spawn background task
        try:
            from backend.app.core.redis_client import get_redis_client
            redis_c = get_redis_client()
            await redis_c.rpush("ai_academy_jobs", json.dumps({
                "run_id": str(run_record.id),
                "lab_slug": lab.slug,
                "params": req.params,
                "user_id": str(current_user.id)
            }))
        except Exception:
            pass
        asyncio.create_task(execute_run_in_background(run_record.id, lab.slug, req.params, current_user.id))
        return run_record

    # Synchronous execution mode (wait=True)
    run_record.status = RunStatus.RUNNING
    run_record.started_at = datetime.now(timezone.utc)
    await db.commit()

    await publish_run_event(str(run_record.id), {
        "event_type": "status_change",
        "status": "RUNNING",
        "message": f"Execution started on worker for lab {lab.slug}."
    })

    try:
        execution_result = await dispatcher.dispatch_lab_execution(lab.slug, req.params)

        run_record.finished_at = datetime.now(timezone.utc)
        exec_duration = execution_result["execution_time_sec"]

        if execution_result["success"]:
            run_record.status = RunStatus.SUCCEEDED
            run_record.metrics = sanitize_json(execution_result["metrics"])
            run_record.artifacts = sanitize_json(execution_result["artifacts"])
            run_record.resource_usage = sanitize_json({
                "cpu_seconds": exec_duration,
                "memory_mb": 128.0
            })
            if quota:
                quota.cpu_seconds_used += exec_duration

            await publish_run_event(str(run_record.id), {
                "event_type": "status_change",
                "status": "SUCCEEDED",
                "metrics": run_record.metrics,
                "duration_sec": exec_duration
            })
        else:
            run_record.status = RunStatus.FAILED
            run_record.error_code = RunErrorCode.INTERNAL
            run_record.error_message = execution_result.get("error", "Engine execution failed")
            await publish_run_event(str(run_record.id), {
                "event_type": "status_change",
                "status": "FAILED",
                "error": run_record.error_message
            })

    except Exception as e:
        run_record.status = RunStatus.FAILED
        run_record.error_code = RunErrorCode.INTERNAL
        run_record.error_message = str(e)
        run_record.finished_at = datetime.now(timezone.utc)
        await publish_run_event(str(run_record.id), {
            "event_type": "status_change",
            "status": "FAILED",
            "error": str(e)
        })

    await db.commit()
    await db.refresh(run_record)
    return run_record

@router.get("/{run_id}", response_model=RunResponse)
async def get_run_status(
    run_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Run).where(Run.id == run_id)
    res = await db.execute(stmt)
    run_item = res.scalar_one_or_none()
    if not run_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    
    # IDOR check: only owner or admin can view run details
    if run_item.user_id != current_user.id and current_user.role.value != "platform_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return run_item

@router.get("", response_model=List[RunResponse])
async def list_user_runs(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Run).where(Run.user_id == current_user.id).order_by(Run.created_at.desc()).offset(offset).limit(limit)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/{run_id}/stream")
async def stream_run_logs(
    run_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Server-Sent Events (SSE) streaming real-time metrics, loss curves, and logs
    from the Redis pubsub channel corresponding to the active run.
    """
    stmt = select(Run).where(Run.id == run_id)
    res = await db.execute(stmt)
    run_item = res.scalar_one_or_none()
    if not run_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    if run_item.user_id != current_user.id and current_user.role.value != "platform_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    async def event_generator() -> AsyncGenerator[str, None]:
        # Initial status event
        yield f"event: message\ndata: {json.dumps({'event_type': 'connected', 'status': run_item.status.value, 'run_id': str(run_item.id)})}\n\n"
        
        if run_item.status in [RunStatus.SUCCEEDED, RunStatus.FAILED]:
            yield f"event: message\ndata: {json.dumps({'event_type': 'status_change', 'status': run_item.status.value, 'metrics': run_item.metrics})}\n\n"
            return

        async for event in subscribe_to_run_events(str(run_id)):
            yield f"event: message\ndata: {json.dumps(event)}\n\n"
            if event.get("status") in ["SUCCEEDED", "FAILED", "succeeded", "failed"]:
                break

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream"
        }
    )
