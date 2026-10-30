from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.models.quota import Quota
from backend.app.models.user import User
from backend.app.schemas.common import QuotaResponse
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/me/quotas", tags=["Quotas & Telemetry"])

@router.get("", response_model=QuotaResponse)
async def get_my_quotas(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Quota).where(Quota.user_id == current_user.id)
    res = await db.execute(stmt)
    quota = res.scalar_one_or_none()
    if not quota:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quotas not initialized for this account")
    return quota
