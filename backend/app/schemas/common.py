import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict

class DatasetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    owner_id: uuid.UUID
    name: str
    media_type: str
    hash: str
    source: str
    license: str
    split_info: Dict[str, Any]
    row_count: int
    columns_info: Dict[str, Any]
    pii_warnings: List[Dict[str, Any]]
    size_bytes: int
    is_public: bool
    created_at: datetime

class ModelResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    model_id: str
    revision: str
    name: str
    license: str
    origin: str
    capabilities: List[str]
    hardware_reqs: Dict[str, Any]
    status: str
    created_at: datetime

class ProjectCreate(BaseModel):
    title: str
    description: str = ""
    visibility: str = "private"
    repo_url: Optional[str] = None
    architecture_md: str = ""
    metrics: Dict[str, Any] = {}
    configs: Dict[str, Any] = {}
    artifacts: Dict[str, Any] = {}

class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    owner_id: uuid.UUID
    title: str
    description: str
    visibility: str
    repo_url: Optional[str]
    architecture_md: str
    metrics: Dict[str, Any]
    configs: Dict[str, Any]
    artifacts: Dict[str, Any]
    commit_hash: Optional[str]
    created_at: datetime
    updated_at: datetime

class QuotaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    cpu_seconds_budget: float
    cpu_seconds_used: float
    gpu_seconds_budget: float
    gpu_seconds_used: float
    storage_bytes_budget: int
    storage_bytes_used: int
    token_budget: int
    token_used: int
    concurrent_runs_limit: int

class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    category: str
    description: str

class UserMasteryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    skill_id: str
    skill_title: str
    mastery_level: str
    issued_at: datetime
    evidence_run_id: Optional[uuid.UUID]

class ProgressResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    total_xp: int
    streak_days: int
    completed_lessons_count: int
    passed_missions_count: int
    mastered_skills_count: int
    recent_runs: List[Dict[str, Any]]
    masteries: List[UserMasteryResponse]
