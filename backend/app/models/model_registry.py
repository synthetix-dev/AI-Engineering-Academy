import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from backend.app.core.database import Base

class ModelItem(Base):
    __tablename__ = "models"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    model_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    revision: Mapped[str] = mapped_column(String(50), default="main", nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    license: Mapped[str] = mapped_column(String(100), default="Apache-2.0", nullable=False)
    origin: Mapped[str] = mapped_column(String(255), nullable=False)
    capabilities: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    hardware_reqs: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="approved", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
