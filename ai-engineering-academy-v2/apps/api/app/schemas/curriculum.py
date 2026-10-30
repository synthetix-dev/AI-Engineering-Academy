from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class CodeExplanationResponse(BaseModel):
    algorithm_name: str
    mathematical_intuition: str
    library_used: str
    library_version: str
    actual_config: Dict[str, Any]
    python_code: str
    sample_inputs: Dict[str, Any]
    sample_outputs: Dict[str, Any]
    curl_request: str
    reproducible_script: str

class DiscoverStepResponse(BaseModel):
    step_number: int
    title: str
    explanation: str
    interactive_type: str
    initial_state: Dict[str, Any]
    expected_outcome_explanation: str
    check_question: Optional[Dict[str, Any]] = None

class DiscoverLessonResponse(BaseModel):
    id: str
    track_id: str
    title: str
    slug: str
    concept_summary: str
    steps: List[DiscoverStepResponse]
    code_explanation: CodeExplanationResponse

class TrackResponse(BaseModel):
    id: str
    number: int
    slug: str
    title: str
    tagline: str
    description: str
    category: str
    estimated_hours: int
    skills_covered: List[str]
    icon: str

class CareerPathResponse(BaseModel):
    id: str
    code: str
    title: str
    description: str
    icon: str
    track_ids: List[str]
    recommended_order: List[str]

class SkillResponse(BaseModel):
    id: str
    code: str
    name: str
    category: str
    description: str
    level: int
    prerequisite_ids: List[str]
    track_id: str
    verification_method: str
