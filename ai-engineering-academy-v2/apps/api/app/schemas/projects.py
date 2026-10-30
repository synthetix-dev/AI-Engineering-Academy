from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ProjectCreate(BaseModel):
    name: str
    description: str
    project_type: str = "companion"  # companion, model, product
    configuration: Optional[Dict[str, Any]] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    evolution_level: Optional[int] = None
    configuration: Optional[Dict[str, Any]] = None
    attached_skills: Optional[List[str]] = None
    status: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: str
    project_type: str
    evolution_level: int
    version: str
    active_model_id: Optional[str] = None
    attached_skills: List[str]
    configuration: Dict[str, Any]
    metrics: Dict[str, float]
    status: str
    created_at: str

    class Config:
        from_attributes = True

class ModelCreate(BaseModel):
    name: str
    description: str
    framework: str = "scikit-learn"
    architecture: str
    base_model: Optional[str] = None
    project_id: Optional[str] = None

class ModelResponse(BaseModel):
    id: str
    name: str
    description: str
    framework: str
    architecture: str
    base_model: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True
