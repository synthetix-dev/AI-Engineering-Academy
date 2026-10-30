import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.models.cms import Lab, Mission
from backend.app.schemas.cms import LabResponse, MissionResponse

router = APIRouter(prefix="/labs", tags=["Labs"])

@router.get("", response_model=List[LabResponse])
async def list_labs(db: AsyncSession = Depends(get_db)):
    stmt = select(Lab).options(selectinload(Lab.missions)).order_by(Lab.created_at)
    result = await db.execute(stmt)
    labs = result.scalars().all()
    return labs

@router.get("/{lab_id}", response_model=LabResponse)
async def get_lab_by_id(lab_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Lab).where(Lab.id == lab_id).options(selectinload(Lab.missions))
    result = await db.execute(stmt)
    lab = result.scalar_one_or_none()
    if not lab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lab not found")
    return lab

@router.get("/slug/{slug}", response_model=LabResponse)
async def get_lab_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Lab).where(Lab.slug == slug).options(selectinload(Lab.missions))
    result = await db.execute(stmt)
    lab = result.scalar_one_or_none()
    if not lab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Lab '{slug}' not found")
    return lab
