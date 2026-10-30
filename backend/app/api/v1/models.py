import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.models.model_registry import ModelItem
from backend.app.schemas.common import ModelResponse

router = APIRouter(prefix="/models", tags=["Model Registry"])

@router.get("", response_model=List[ModelResponse])
async def list_models(db: AsyncSession = Depends(get_db)):
    stmt = select(ModelItem).order_by(ModelItem.name)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/{model_id}", response_model=ModelResponse)
async def get_model(model_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(ModelItem).where(ModelItem.id == model_id)
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found in approved registry")
    return item
