from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ChallengeResponse(BaseModel):
    id: str
    track_slug: str
    title: str
    difficulty: str
    problem_statement: str
    bug_symptom: str
    broken_config: Dict[str, Any]
    target_criteria: List[Dict[str, Any]]
    xp_reward: int

class ChallengeAttemptCreate(BaseModel):
    challenge_id: str
    submitted_config: Dict[str, Any]

class ChallengeAttemptResponse(BaseModel):
    id: str
    challenge_id: str
    status: str
    passed: bool
    score: int
    metrics: Dict[str, float]
    passed_tests: int
    total_tests: int
    xp_awarded: int
    feedback: str
    logs: List[str]

class EvaluationResponse(BaseModel):
    id: str
    task_id: str
    dataset_id: str
    metrics: Dict[str, float]
    passed: bool
    deterministic_hash: str
    execution_time_ms: float
