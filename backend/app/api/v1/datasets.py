import os
import uuid
import hashlib
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
import pandas as pd

from backend.app.core.database import get_db
from backend.app.core.config import settings
from backend.app.models.dataset import Dataset
from backend.app.models.quota import Quota
from backend.app.models.user import User
from backend.app.schemas.common import DatasetResponse
from backend.app.api.deps import get_current_user
from backend.app.engines import data_engine

router = APIRouter(prefix="/datasets", tags=["Datasets"])

@router.get("", response_model=List[DatasetResponse])
async def list_datasets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Dataset)
        .where(or_(Dataset.owner_id == current_user.id, Dataset.is_public == True))
        .order_by(Dataset.created_at.desc())
    )
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    file: UploadFile = File(...),
    name: str = Form(...),
    license: str = Form("CC-BY-4.0"),
    is_public: bool = Form(False),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload and register dataset:
    - Enforce user storage quota
    - Compute SHA-256 hash
    - Parse CSV and profile statistical features
    - Scan for PII (emails, cards, keys)
    - Store securely with ownership isolation
    """
    content = await file.read()
    file_size = len(content)
    if file_size > 50 * 1024 * 1024:  # 50 MB limit per file
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Dataset exceeds 50MB limit")

    # Check and enforce storage quota
    q_stmt = select(Quota).where(Quota.user_id == current_user.id)
    q_res = await db.execute(q_stmt)
    quota = q_res.scalar_one_or_none()

    if quota:
        if quota.storage_bytes_used + file_size > quota.storage_bytes_budget:
            remaining = max(0, quota.storage_bytes_budget - quota.storage_bytes_used)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Storage quota exceeded: upload requires {file_size} bytes, but only {remaining} bytes remaining in budget."
            )
        quota.storage_bytes_used += file_size

    sha256_hash = hashlib.sha256(content).hexdigest()

    # Parse and profile dataframe
    try:
        import io
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        # Rollback quota if parsing fails
        if quota:
            quota.storage_bytes_used -= file_size
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid CSV format: {str(e)}")

    profile = data_engine.profile_dataset(df)

    # Save to disk
    file_id = f"ds_{uuid.uuid4().hex[:12]}.csv"
    os.makedirs(os.path.join(settings.STORAGE_DIR, "datasets"), exist_ok=True)
    dest_path = os.path.join(settings.STORAGE_DIR, "datasets", file_id)
    with open(dest_path, "wb") as f:
        f.write(content)

    new_dataset = Dataset(
        owner_id=current_user.id,
        name=name,
        media_type=file.content_type or "text/csv",
        hash=sha256_hash,
        source="user_upload",
        license=license,
        split_info={"rows": len(df), "columns_count": len(df.columns)},
        storage_ref=dest_path,
        row_count=len(df),
        columns_info=profile["columns"],
        pii_warnings=profile["pii_warnings"],
        size_bytes=file_size,
        is_public=is_public
    )
    db.add(new_dataset)
    await db.commit()
    await db.refresh(new_dataset)

    return new_dataset

@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(
    dataset_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Dataset).where(Dataset.id == dataset_id)
    res = await db.execute(stmt)
    dataset = res.scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")

    if not dataset.is_public and dataset.owner_id != current_user.id and current_user.role.value != "platform_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return dataset

@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dataset(
    dataset_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Dataset).where(Dataset.id == dataset_id)
    res = await db.execute(stmt)
    dataset = res.scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")

    if dataset.owner_id != current_user.id and current_user.role.value != "platform_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Reclaim storage quota
    q_stmt = select(Quota).where(Quota.user_id == dataset.owner_id)
    q_res = await db.execute(q_stmt)
    quota = q_res.scalar_one_or_none()
    if quota and dataset.size_bytes:
        quota.storage_bytes_used = max(0, quota.storage_bytes_used - dataset.size_bytes)

    # Delete physical file
    if dataset.storage_ref and os.path.exists(dataset.storage_ref):
        try:
            os.remove(dataset.storage_ref)
        except OSError:
            pass

    await db.delete(dataset)
    await db.commit()
    return None
