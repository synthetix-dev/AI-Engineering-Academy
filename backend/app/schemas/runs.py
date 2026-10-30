import uuid
from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict
from backend.app.models.enums import ExecutionMode, RunStatus, RunErrorCode

class RunCreate(BaseModel):
    lab_id: uuid.UUID
    lab_version: str = "1.0.0"
    execution_mode: ExecutionMode = ExecutionMode.CPU_REAL
    params: Dict[str, Any] = {}
    seed: int = 42
    idempotency_key: Optional[str] = None

RunCreateRequest = RunCreate

class RunEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    run_id: uuid.UUID
    sequence: int
    event_type: str
    payload: Dict[str, Any]
    created_at: datetime

class RunResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    user_id: uuid.UUID
    lab_id: uuid.UUID
    lab_version: str
    execution_mode: ExecutionMode
    model_revision: Optional[str]
    dataset_hash: Optional[str]
    params: Dict[str, Any]
    seed: int
    status: RunStatus
    metrics: Dict[str, Any]
    artifacts: Dict[str, Any]
    resource_usage: Dict[str, Any]
    error_code: RunErrorCode
    error_message: Optional[str]
    trace_id: str
    created_at: datetime
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
