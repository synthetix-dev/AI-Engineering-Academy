import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, BigInteger, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.core.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    media_type: Mapped[str] = mapped_column(String(100), default="text/csv", nullable=False)
    hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)  # SHA-256
    source: Mapped[str] = mapped_column(String(255), default="user_upload", nullable=False)
    license: Mapped[str] = mapped_column(String(100), default="CC-BY-4.0", nullable=False)
    split_info: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    storage_ref: Mapped[str] = mapped_column(String(500), nullable=False)
    row_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    columns_info: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    pii_warnings: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="datasets")
