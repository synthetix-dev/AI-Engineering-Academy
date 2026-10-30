import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.core.database import Base
from backend.app.models.enums import ExecutionMode, RunStatus, RunErrorCode, ProjectVisibility

class Run(Base):
    __tablename__ = "runs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    lab_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("labs.id", ondelete="CASCADE"), nullable=False, index=True)
    lab_version: Mapped[str] = mapped_column(String(20), default="1.0.0", nullable=False)
    execution_mode: Mapped[ExecutionMode] = mapped_column(SAEnum(ExecutionMode, name="execution_mode"), default=ExecutionMode.CPU_REAL, nullable=False)
    model_revision: Mapped[str | None] = mapped_column(String(100), nullable=True)
    dataset_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    params: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    seed: Mapped[int] = mapped_column(Integer, default=42, nullable=False)
    status: Mapped[RunStatus] = mapped_column(SAEnum(RunStatus, name="run_status"), default=RunStatus.QUEUED, nullable=False, index=True)
    metrics: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    artifacts: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    resource_usage: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)  # cpu_seconds, memory_mb, tokens
    error_code: Mapped[RunErrorCode] = mapped_column(SAEnum(RunErrorCode, name="run_error_code"), default=RunErrorCode.NONE, nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    trace_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    idempotency_key: Mapped[str | None] = mapped_column(String(128), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="runs")
    lab = relationship("Lab", back_populates="runs")
    events = relationship("RunEvent", back_populates="run", cascade="all, delete-orphan", order_by="RunEvent.sequence")

class RunEvent(Base):
    __tablename__ = "run_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("runs.id", ondelete="CASCADE"), nullable=False, index=True)
    sequence: Mapped[int] = mapped_column(Integer, nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)  # log, metric, step, status_change, approval_required
    payload: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    run = relationship("Run", back_populates="events")

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    visibility: Mapped[ProjectVisibility] = mapped_column(SAEnum(ProjectVisibility, name="project_visibility"), default=ProjectVisibility.PRIVATE, nullable=False)
    repo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    architecture_md: Mapped[str] = mapped_column(Text, default="", nullable=False)
    metrics: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    configs: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    artifacts: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    commit_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="projects")
