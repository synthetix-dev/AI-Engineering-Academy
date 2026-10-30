from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class PortfolioItemCreate(BaseModel):
    project_id: str
    title: str
    summary: str
    is_public: bool = True

class PortfolioItemResponse(BaseModel):
    id: str
    title: str
    summary: str
    skills_demonstrated: List[str]
    verified_metrics: Dict[str, float]
    public_slug: str
    is_public: bool
    interactive_demo_config: Dict[str, Any]
    created_at: str

class AchievementResponse(BaseModel):
    id: str
    code: str
    title: str
    description: str
    icon: str
    xp_points: int
    unlocked: bool = False

class AdminStatsResponse(BaseModel):
    total_users: int
    active_experiments: int
    trained_models: int
    completed_challenges: int
    verified_skills: int
    queue_status: Dict[str, Any]
    resource_usage: Dict[str, Any]
