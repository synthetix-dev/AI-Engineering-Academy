from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User, UserPreferences
from app.schemas.auth import UserUpdate, UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def read_user_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        career_goal=current_user.career_goal,
        xp=current_user.xp,
        level=current_user.level,
        created_at=current_user.created_at.isoformat()
    )

@router.patch("/me", response_model=UserResponse)
async def update_user_me(
    payload: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.career_goal is not None:
        current_user.career_goal = payload.career_goal

    if payload.theme is not None or payload.auto_inspect_code is not None:
        res = await db.execute(select(UserPreferences).where(UserPreferences.user_id == current_user.id))
        prefs = res.scalars().first()
        if prefs:
            if payload.theme is not None:
                prefs.theme = payload.theme
            if payload.auto_inspect_code is not None:
                prefs.auto_inspect_code = payload.auto_inspect_code

    await db.commit()
    await db.refresh(current_user)
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        career_goal=current_user.career_goal,
        xp=current_user.xp,
        level=current_user.level,
        created_at=current_user.created_at.isoformat()
    )
