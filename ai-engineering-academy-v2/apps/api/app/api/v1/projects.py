from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.projects import Project
from app.schemas.projects import ProjectCreate, ProjectUpdate, ProjectResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/projects", tags=["AI Evolution Projects"])

@router.get("", response_model=List[ProjectResponse])
async def list_user_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(Project).where(Project.user_id == current_user.id).order_by(Project.created_at.desc()))
    projects = res.scalars().all()
    return [
        ProjectResponse(
            id=p.id,
            name=p.name,
            description=p.description,
            project_type=p.project_type,
            evolution_level=p.evolution_level,
            version=p.version,
            active_model_id=p.active_model_id,
            attached_skills=p.attached_skills_json or [],
            configuration=p.configuration_json or {},
            metrics={k: float(v) for k, v in (p.metrics_json or {}).items() if isinstance(v, (int, float))},
            status=p.status,
            created_at=p.created_at.isoformat()
        )
        for p in projects
    ]

@router.post("", response_model=ProjectResponse)
async def create_project(
    payload: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = Project(
        user_id=current_user.id,
        name=payload.name,
        description=payload.description,
        project_type=payload.project_type,
        evolution_level=1,
        version="1.0.0",
        attached_skills_json=["FOUNDATIONS_PYTHON"],
        configuration_json=payload.configuration or {},
        metrics_json={"accuracy": 0.0, "latency_ms": 0.0},
        status="draft"
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)

    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        project_type=project.project_type,
        evolution_level=project.evolution_level,
        version=project.version,
        active_model_id=project.active_model_id,
        attached_skills=project.attached_skills_json,
        configuration=project.configuration_json,
        metrics={k: float(v) for k, v in project.metrics_json.items() if isinstance(v, (int, float))},
        status=project.status,
        created_at=project.created_at.isoformat()
    )

@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    payload: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(Project).where(Project.id == project_id, Project.user_id == current_user.id))
    project = res.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено")

    if payload.name is not None:
        project.name = payload.name
    if payload.description is not None:
        project.description = payload.description
    if payload.evolution_level is not None:
        project.evolution_level = payload.evolution_level
        project.version = f"1.{payload.evolution_level}.0"
    if payload.configuration is not None:
        project.configuration_json = payload.configuration
    if payload.attached_skills is not None:
        project.attached_skills_json = payload.attached_skills
    if payload.status is not None:
        project.status = payload.status

    await db.commit()
    await db.refresh(project)

    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        project_type=project.project_type,
        evolution_level=project.evolution_level,
        version=project.version,
        active_model_id=project.active_model_id,
        attached_skills=project.attached_skills_json,
        configuration=project.configuration_json,
        metrics={k: float(v) for k, v in project.metrics_json.items() if isinstance(v, (int, float))},
        status=project.status,
        created_at=project.created_at.isoformat()
    )
