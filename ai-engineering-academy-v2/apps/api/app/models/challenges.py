import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    track_slug = Column(String(100), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="junior", nullable=False)  # junior, middle, senior
    problem_statement = Column(Text, nullable=False)
    bug_symptom = Column(Text, nullable=False)
    broken_config_json = Column(JSON, default=dict, nullable=False)
    target_criteria_json = Column(JSON, default=list, nullable=False)
    xp_reward = Column(Integer, default=100, nullable=False)

    attempts = relationship("ChallengeAttempt", back_populates="challenge", cascade="all, delete-orphan")

class ChallengeAttempt(Base):
    __tablename__ = "challenge_attempts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    challenge_id = Column(String(36), ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    submitted_config_json = Column(JSON, default=dict, nullable=False)
    status = Column(String(50), default="evaluating", nullable=False)  # passed, failed, evaluating
    metrics_json = Column(JSON, default=dict, nullable=False)
    logs_json = Column(JSON, default=list, nullable=False)
    passed_tests = Column(Integer, default=0, nullable=False)
    total_tests = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    challenge = relationship("Challenge", back_populates="attempts")
    user = relationship("User", back_populates="attempts")

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(100), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    model_id = Column(String(36), nullable=True, index=True)
    dataset_id = Column(String(100), nullable=False)
    metrics_json = Column(JSON, default=dict, nullable=False)
    passed = Column(Boolean, default=False, nullable=False)
    deterministic_hash = Column(String(64), nullable=False)
    errors_json = Column(JSON, default=list, nullable=False)
    execution_time_ms = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="available", nullable=False)  # locked, available, in_progress, verified
    verified_at = Column(DateTime, nullable=True)
    score = Column(Float, nullable=True)
    attempt_id = Column(String(36), nullable=True)

    user = relationship("User", back_populates="skill_progress")
