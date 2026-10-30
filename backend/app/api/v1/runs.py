import uuid
import json
import asyncio
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
import torch

from backend.app.core.database import get_db, AsyncSessionLocal
from backend.app.core.redis_client import get_redis_client, publish_run_event
from backend.app.models.cms import Lab
from backend.app.models.run import Run, RunEvent
from backend.app.models.quota import Quota
from backend.app.models.user import User
from backend.app.models.enums import ExecutionMode, RunStatus, RunErrorCode
from backend.app.schemas.runs import RunCreate, RunResponse
from backend.app.api.deps import get_current_user
from backend.app.engines import dispatcher

router = APIRouter(prefix="/runs", tags=["Lab Runs"])

@router.post("", response_model=RunResponse, status_code=status.HTTP_201_CREATED)
async def create_and_execute_run(
    req: RunCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Validate parameters, reserve quota, start real execution on isolated engine,
    and persist artifacts and metrics.
    """
    # 1. Fetch Lab
    stmt_lab = select(Lab).where(Lab.id == req.lab_id)
    res_lab = await db.execute(stmt_lab)
    lab = res_lab.scalar_one_or_none()
    if not lab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lab not found")

    # 2. Check and Reserve User Quota
    stmt_quota = select(Quota).where(Quota.user_id == current_user.id)
    res_quota = await db.execute(stmt_quota)
    quota = res_quota.scalar_one_or_none()
    if not quota:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quota profile not found for user")

    if quota.cpu_seconds_used >= quota.cpu_seconds_budget:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="CPU quota budget exhausted. Please wait for reset or request an operator limit increase."
        )

    # 3. Check Execution Mode
    actual_mode = req.execution_mode
    if req.execution_mode == ExecutionMode.GPU_REAL:
        # Check if actual GPU is physically available
        has_gpu = torch.cuda.is_available() or torch.backends.mps.is_available()
        if not has_gpu:
            # Per section 13: "Якщо немає GPU: повідомити про нестачу ресурсів"
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

    # 6. Execute Real Computational Engine
    run_record.status = RunStatus.RUNNING
    run_record.started_at = datetime.now(timezone.utc)
    await db.commit()

    # Emit initial running event via Redis
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
            run_record.metrics = execution_result["metrics"]
            run_record.artifacts = execution_result["artifacts"]
            run_record.resource_usage = {
                "cpu_seconds": exec_duration,
                "memory_mb": 128.0
            }
            quota.cpu_seconds_used += exec_duration

            # Emit completion event
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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this run")

    return run_item

@router.get("/{run_id}/events")
async def stream_run_events(
    run_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Server-Sent Events (SSE) stream for real-time trace telemetry."""
    stmt = select(Run).where(Run.id == run_id)
    res = await db.execute(stmt)
    run_item = res.scalar_one_or_none()
    if not run_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")

    if run_item.user_id != current_user.id and current_user.role.value != "platform_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    async def event_generator():
        client = get_redis_client()
        pubsub = client.pubsub()
        channel = f"run_events:{run_id}"
        await pubsub.subscribe(channel)

        # First yield the current snapshot
        snapshot = {
            "event_type": "initial_snapshot",
            "status": run_item.status.value,
            "metrics": run_item.metrics,
            "trace_id": run_item.trace_id
        }
        yield f"data: {json.dumps(snapshot)}\n\n"

        if run_item.status in [RunStatus.SUCCEEDED, RunStatus.FAILED, RunStatus.CANCELLED]:
            await pubsub.unsubscribe(channel)
            return

        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                if message and message.get("data"):
                    payload_str = message["data"]
                    yield f"data: {payload_str}\n\n"
                    # Check if terminal
                    try:
                        data_obj = json.loads(payload_str)
                        if data_obj.get("status") in ["SUCCEEDED", "FAILED", "CANCELLED"]:
                            break
                    except Exception:
                        pass
                await asyncio.sleep(0.5)
        finally:
            await pubsub.unsubscribe(channel)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/{run_id}/cancel")
async def cancel_run(
    run_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Run).where(Run.id == run_id)
    res = await db.execute(stmt)
    run_item = res.scalar_one_or_none()
    if not run_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")

    if run_item.user_id != current_user.id and current_user.role.value != "platform_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if run_item.status in [RunStatus.QUEUED, RunStatus.RUNNING]:
        run_item.status = RunStatus.CANCELLED
        run_item.finished_at = datetime.now(timezone.utc)
        await db.commit()
        await publish_run_event(str(run_id), {"event_type": "status_change", "status": "CANCELLED"})

    return {"status": "cancelled", "run_id": str(run_id)}
