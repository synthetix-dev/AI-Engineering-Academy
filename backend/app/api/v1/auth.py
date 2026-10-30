from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.core.security import get_password_hash, verify_password, create_access_token
from backend.app.core.config import settings
from backend.app.models.user import User
from backend.app.models.quota import Quota
from backend.app.models.enums import UserRole
from backend.app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(req: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    existing = await db.execute(select(User).where(User.email == req.email.lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Account with this email already exists"
        )

    new_user = User(
        email=req.email.lower(),
        password_hash=get_password_hash(req.password),
        full_name=req.full_name,
        role=UserRole.LEARNER,
        locale=req.locale,
        status="active",
        is_active=True,
        xp=0,
        streak_days=1,
        last_activity_at=datetime.now(timezone.utc)
    )
    db.add(new_user)
    await db.flush()

    # Assign default learner quota
    default_quota = Quota(
        user_id=new_user.id,
        cpu_seconds_budget=3600.0,
        gpu_seconds_budget=600.0,
        storage_bytes_budget=524288000, # 500MB
        token_budget=100000,
        concurrent_runs_limit=3
    )
    db.add(default_quota)
    await db.commit()
    await db.refresh(new_user)

    return new_user

@router.post("/login", response_model=Token)
async def login(req: UserLogin, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == req.email.lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    user.last_activity_at = datetime.now(timezone.utc)
    await db.commit()

    token_str = create_access_token(subject=str(user.id))
    return Token(
        access_token=token_str,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
