import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict
from backend.app.models.enums import RuntimeClass

class MissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    lab_id: uuid.UUID
    title: str
    description: str
    difficulty: str
    rubric: Dict[str, Any]
    xp_reward: int

class LabResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    slug: str
    semantic_version: str
    title: str
    description: str
    outcomes: List[str]
    required_skills: List[str]
    runtime_class: RuntimeClass
    cost_weight: float
    max_duration_sec: int
    supported_locales: List[str]
    config_schema: Dict[str, Any]
    default_config: Dict[str, Any]
    missions: List[MissionResponse] = []

class LessonResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    course_id: uuid.UUID
    lab_id: Optional[uuid.UUID]
    slug: str
    title: str
    order: int
    content_md: str
    theory_summary: str
    visual_algorithm_md: str
    quiz_questions: List[Dict[str, Any]]
    lab: Optional[LabResponse] = None

class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    track_id: uuid.UUID
    slug: str
    title: str
    description: str
    level: str
    order: int
    lessons: List[LessonResponse] = []

class TrackResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    slug: str
    version: str
    title: str
    description: str
    order: int
    icon: str
    outcomes: List[str]
    prerequisites: List[str]
    status: str
    courses: List[CourseResponse] = []
    labs: List[LabResponse] = []

class AttemptSubmit(BaseModel):
    lesson_id: Optional[uuid.UUID] = None
    mission_id: Optional[uuid.UUID] = None
    evidence_run_id: Optional[uuid.UUID] = None
    quiz_answers: Optional[List[int]] = None
