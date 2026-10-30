import uuid
import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.models.run import Project
from backend.app.models.user import User
from backend.app.models.enums import ProjectVisibility
from backend.app.schemas.common import ProjectCreate, ProjectResponse
from backend.app.api.deps import get_current_user, get_optional_user

router = APIRouter(prefix="/projects", tags=["Portfolio & Projects"])

@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    current_user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        stmt = select(Project).where(
            or_(Project.owner_id == current_user.id, Project.visibility == ProjectVisibility.PUBLIC)
        ).order_by(Project.updated_at.desc())
    else:
        stmt = select(Project).where(
            Project.visibility == ProjectVisibility.PUBLIC
        ).order_by(Project.updated_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    req: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    visibility_enum = ProjectVisibility.PUBLIC if req.visibility == "public" else ProjectVisibility.PRIVATE
    new_project = Project(
        owner_id=current_user.id,
        title=req.title,
        description=req.description,
        visibility=visibility_enum,
        repo_url=req.repo_url,
        architecture_md=req.architecture_md,
        metrics=req.metrics,
        configs=req.configs,
        artifacts=req.artifacts,
        commit_hash=uuid.uuid4().hex[:10]
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: uuid.UUID,
    current_user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Project).where(Project.id == project_id)
    res = await db.execute(stmt)
    project = res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if project.visibility != ProjectVisibility.PUBLIC:
        if not current_user or (project.owner_id != current_user.id and current_user.role.value != "platform_admin"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to private project")

    return project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: uuid.UUID,
    req: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update project with strict IDOR ownership enforcement (SEC-04)."""
    stmt = select(Project).where(Project.id == project_id)
    res = await db.execute(stmt)
    project = res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if project.owner_id != current_user.id and current_user.role.value != "platform_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to edit this project")

    project.title = req.title
    project.description = req.description
    project.visibility = ProjectVisibility.PUBLIC if req.visibility == "public" else ProjectVisibility.PRIVATE
    project.repo_url = req.repo_url
    project.architecture_md = req.architecture_md
    project.metrics = req.metrics
    project.configs = req.configs
    project.artifacts = req.artifacts

    await db.commit()
    await db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete project with strict IDOR ownership enforcement (SEC-04)."""
    stmt = select(Project).where(Project.id == project_id)
    res = await db.execute(stmt)
    project = res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if project.owner_id != current_user.id and current_user.role.value != "platform_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this project")

    await db.delete(project)
    await db.commit()
    return None

@router.get("/{project_id}/export/markdown")
async def export_project_markdown(
    project_id: uuid.UUID,
    current_user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate and export a clean, reproducible markdown portfolio report."""
    stmt = select(Project).where(Project.id == project_id)
    res = await db.execute(stmt)
    project = res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if project.visibility != ProjectVisibility.PUBLIC:
        if not current_user or (project.owner_id != current_user.id and current_user.role.value != "platform_admin"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to private project")

    md_content = f"""# {project.title}
*AI Engineering Academy — Відтворюваний звіт проєкту*

**Автор проєкту:** ID `{project.owner_id}`  
**Commit Hash:** `{project.commit_hash}`  
**Дата оновлення:** {project.updated_at.isoformat()}  
**Посилання на репозиторій:** {project.repo_url or "Внутрішній проект академії"}

---

## 1. Опис задачі
{project.description or "Не надано"}

## 2. Архітектура та пайплайн
{project.architecture_md or "Архітектурний опис відсутній"}

## 3. Результати та метрики
```json
{json.dumps(project.metrics, indent=2, ensure_ascii=False)}
```

## 4. Конфігурація відтворюваності
```json
{json.dumps(project.configs, indent=2, ensure_ascii=False)}
```

---
*Згенеровано автоматично платформою AI Engineering Academy на базі відкритих технологій.*
"""
    return Response(
        content=md_content,
        media_type="text/markdown",
        headers={"Content-Disposition": f"attachment; filename=project_{project_id}.md"}
    )
