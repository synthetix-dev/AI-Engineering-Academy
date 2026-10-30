import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    project_type = Column(String(50), default="companion", nullable=False)  # companion, model, product
    evolution_level = Column(Integer, default=1, nullable=False)
    version = Column(String(50), default="1.0.0", nullable=False)
    active_model_id = Column(String(36), nullable=True)
    attached_skills_json = Column(JSON, default=list, nullable=False)
    configuration_json = Column(JSON, default=dict, nullable=False)
    metrics_json = Column(JSON, default=dict, nullable=False)
    status = Column(String(50), default="draft", nullable=False)  # draft, trained, evaluated, deployed
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="projects")
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
    models = relationship("ModelRegistry", back_populates="project", cascade="all, delete-orphan")
    training_jobs = relationship("TrainingJob", back_populates="project", cascade="all, delete-orphan")
    experiment_runs = relationship("ExperimentRun", back_populates="project", cascade="all, delete-orphan")

class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(50), default="contributor", nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship("Project", back_populates="members")

class ModelRegistry(Base):
    __tablename__ = "models"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    framework = Column(String(50), default="pytorch", nullable=False)  # pytorch, scikit-learn, onnx, tfjs
    architecture = Column(String(100), nullable=False)
    base_model = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship("Project", back_populates="models")
    versions = relationship("ModelVersion", back_populates="model", cascade="all, delete-orphan")

class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_id = Column(String(36), ForeignKey("models.id", ondelete="CASCADE"), nullable=False, index=True)
    version_tag = Column(String(50), default="v1.0.0", nullable=False)
    weights_path = Column(String(512), nullable=True)
    metrics_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    model = relationship("ModelRegistry", back_populates="versions")
    adapters = relationship("ModelAdapter", back_populates="model_version", cascade="all, delete-orphan")

class ModelAdapter(Base):
    __tablename__ = "model_adapters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_version_id = Column(String(36), ForeignKey("model_versions.id", ondelete="CASCADE"), nullable=False, index=True)
    adapter_type = Column(String(50), default="lora", nullable=False)  # lora, qlora, prefix
    rank_r = Column(Integer, default=8, nullable=False)
    alpha = Column(Integer, default=16, nullable=False)
    weights_path = Column(String(512), nullable=True)
    parameters_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    model_version = relationship("ModelVersion", back_populates="adapters")
