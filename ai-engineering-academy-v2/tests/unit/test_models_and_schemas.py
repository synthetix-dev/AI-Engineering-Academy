import pytest
from app.models.user import User, UserPreferences
from app.models.curriculum import CareerPath, Skill, Lesson, Activity
from app.models.challenges import Challenge, ChallengeAttempt, Evaluation, UserSkillProgress
from app.models.projects import Project, ModelRegistry, ModelVersion, ModelAdapter
from app.models.data_ml import Dataset, TrainingJob, ExperimentRun, Artifact
from app.models.rag_agent import RAGCollection, RAGDocument, AgentConfig, AgentRun
from app.models.portfolio import Achievement, PortfolioItem, AuditEvent

def test_user_model_initialization():
    user = User(
        email="test@academy.ai",
        hashed_password="hash",
        full_name="Тестовий Користувач",
        role="student",
        career_goal="ai_engineer",
        xp=0,
        level=1
    )
    assert user.email == "test@academy.ai"
    assert user.role == "student"
    assert user.xp == 0
    assert user.level == 1

def test_project_model_types():
    project = Project(
        user_id="user-123",
        name="AI Companion",
        description="Розумний помічник",
        project_type="companion",
        evolution_level=1,
        version="1.0.0"
    )
    assert project.project_type == "companion"
    assert project.version == "1.0.0"

def test_challenge_model():
    challenge = Challenge(
        track_slug="machine-learning",
        title="Overfitting Challenge",
        difficulty="middle",
        problem_statement="Model overfits on noise",
        bug_symptom="Train 100%, test 60%",
        xp_reward=150
    )
    assert challenge.track_slug == "machine-learning"
    assert challenge.xp_reward == 150
