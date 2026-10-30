from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ExperimentRunCreate(BaseModel):
    track_slug: str
    run_name: Optional[str] = "Experiment Run"
    project_id: Optional[str] = None
    parameters: Dict[str, Any]

class ExperimentRunResponse(BaseModel):
    id: str
    track_slug: str
    run_name: str
    success: bool
    parameters: Dict[str, Any]
    metrics: Dict[str, Any]
    artifacts: Dict[str, Any]
    execution_time_sec: float
    error: Optional[str] = None

class TrainingJobCreate(BaseModel):
    project_id: Optional[str] = None
    job_type: str = "ml_training"
    parameters: Dict[str, Any]

class TrainingJobResponse(BaseModel):
    id: str
    job_type: str
    status: str
    parameters: Dict[str, Any]
    metrics: Dict[str, Any]
    error_message: Optional[str] = None

class DatasetResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    category: str
    size_records: int
    schema_def: Dict[str, Any]
    preview: List[Dict[str, Any]]
