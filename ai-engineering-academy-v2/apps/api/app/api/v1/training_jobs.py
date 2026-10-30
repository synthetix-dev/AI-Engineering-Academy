import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db, AsyncSessionLocal
from app.models.user import User
from app.models.data_ml import TrainingJob
from app.schemas.experiments import TrainingJobCreate, TrainingJobResponse
from app.api.deps import get_current_user
from app.engines.dispatcher import dispatch_lab_execution

router = APIRouter(prefix="/training-jobs", tags=["Training Jobs"])

async def execute_background_job(job_id: str, job_type: str, parameters: dict):
    """Background worker execution for long-running CPU/GPU training tasks."""
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(TrainingJob).where(TrainingJob.id == job_id))
        job = res.scalars().first()
        if not job or job.status == "cancelled":
            return

        job.status = "running"
        job.started_at = datetime.utcnow()
        await session.commit()

        try:
            # Map job_type to engine
            if job_type == "fine_tuning":
                engine_res = await dispatch_lab_execution("finetuning-lab", parameters)
            else:
                engine_res = await dispatch_lab_execution("ml-playground", parameters)

            job.status = "completed" if engine_res.get("success", True) else "failed"
            job.metrics_json = engine_res.get("metrics", {})
            job.completed_at = datetime.utcnow()
        except Exception as e:
            job.status = "failed"
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()

        await session.commit()

@router.post("", response_model=TrainingJobResponse)
async def create_training_job(
    payload: TrainingJobCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = TrainingJob(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        project_id=payload.project_id,
        job_type=payload.job_type,
        status="queued",
        parameters_json=payload.parameters,
        metrics_json={}
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    # Dispatch to background task worker
    background_tasks.add_task(execute_background_job, job.id, job.job_type, payload.parameters)

    return TrainingJobResponse(
        id=job.id,
        job_type=job.job_type,
        status=job.status,
        parameters=job.parameters_json,
        metrics=job.metrics_json
    )

@router.get("/{job_id}", response_model=TrainingJobResponse)
async def get_training_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(TrainingJob).where(TrainingJob.id == job_id, TrainingJob.user_id == current_user.id))
    job = res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Задачу навчання не знайдено")
    return TrainingJobResponse(
        id=job.id,
        job_type=job.job_type,
        status=job.status,
        parameters=job.parameters_json,
        metrics=job.metrics_json,
        error_message=job.error_message
    )

@router.post("/{job_id}/cancel")
async def cancel_training_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(TrainingJob).where(TrainingJob.id == job_id, TrainingJob.user_id == current_user.id))
    job = res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Задачу не знайдено")
    if job.status in ["completed", "failed", "cancelled"]:
        return {"status": job.status, "message": "Задача вже завершена"}
    job.status = "cancelled"
    job.completed_at = datetime.utcnow()
    await db.commit()
    return {"status": "cancelled", "message": "Задачу скасовано"}
