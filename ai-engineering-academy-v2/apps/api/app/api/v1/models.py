from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.projects import ModelRegistry, ModelVersion
from app.schemas.projects import ModelCreate, ModelResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/models", tags=["Model Registry"])

@router.get("", response_model=List[ModelResponse])
async def list_models(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(ModelRegistry).where(ModelRegistry.user_id == current_user.id))
    models = res.scalars().all()
    return [
        ModelResponse(
            id=m.id,
            name=m.name,
            description=m.description,
            framework=m.framework,
            architecture=m.architecture,
            base_model=m.base_model,
            created_at=m.created_at.isoformat()
        )
        for m in models
    ]

@router.post("", response_model=ModelResponse)
async def register_model(
    payload: ModelCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    model = ModelRegistry(
        user_id=current_user.id,
        project_id=payload.project_id,
        name=payload.name,
        description=payload.description,
        framework=payload.framework,
        architecture=payload.architecture,
        base_model=payload.base_model
    )
    db.add(model)
    await db.commit()
    await db.refresh(model)

    return ModelResponse(
        id=model.id,
        name=model.name,
        description=model.description,
        framework=model.framework,
        architecture=model.architecture,
        base_model=model.base_model,
        created_at=model.created_at.isoformat()
    )
