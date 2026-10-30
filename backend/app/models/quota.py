import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, BigInteger, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.core.database import Base

class Quota(Base):
    __tablename__ = "quotas"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    cpu_seconds_budget: Mapped[float] = mapped_column(Float, default=3600.0, nullable=False)
    cpu_seconds_used: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    gpu_seconds_budget: Mapped[float] = mapped_column(Float, default=600.0, nullable=False)
    gpu_seconds_used: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    storage_bytes_budget: Mapped[int] = mapped_column(BigInteger, default=524288000, nullable=False) # 500 MB
    storage_bytes_used: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    token_budget: Mapped[int] = mapped_column(Integer, default=100000, nullable=False)
    token_used: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    concurrent_runs_limit: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    reset_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="quotas")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True, index=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_kind: Mapped[str] = mapped_column(String(50), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    details: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
