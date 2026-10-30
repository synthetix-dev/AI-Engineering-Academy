import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    size_records = Column(Integer, default=0, nullable=False)
    schema_json = Column(JSON, default=dict, nullable=False)
    preview_json = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    versions = relationship("DatasetVersion", back_populates="dataset", cascade="all, delete-orphan")

class DatasetVersion(Base):
    __tablename__ = "dataset_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = Column(String(36), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    version_tag = Column(String(50), default="v1", nullable=False)
    file_path = Column(String(512), nullable=True)
    row_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    dataset = relationship("Dataset", back_populates="versions")

class TrainingJob(Base):
    __tablename__ = "training_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True)
    job_type = Column(String(50), default="ml_training", nullable=False)  # ml_training, fine_tuning, eval
    status = Column(String(50), default="queued", nullable=False)  # queued, running, completed, failed, timeout, cancelled
    parameters_json = Column(JSON, default=dict, nullable=False)
    metrics_json = Column(JSON, default=dict, nullable=False)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="training_jobs")

class ExperimentRun(Base):
    __tablename__ = "experiment_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True)
    run_name = Column(String(255), nullable=False)
    track_slug = Column(String(100), index=True, nullable=False)
    parameters_json = Column(JSON, default=dict, nullable=False)
    metrics_json = Column(JSON, default=dict, nullable=False)
    artifacts_json = Column(JSON, default=dict, nullable=False)
    execution_time_sec = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship("Project", back_populates="experiment_runs")
    metrics_history = relationship("ExperimentMetric", back_populates="experiment_run", cascade="all, delete-orphan")
    artifacts = relationship("Artifact", back_populates="experiment_run", cascade="all, delete-orphan")

class ExperimentMetric(Base):
    __tablename__ = "experiment_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    experiment_run_id = Column(String(36), ForeignKey("experiment_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    epoch = Column(Integer, default=1, nullable=False)
    step = Column(Integer, default=1, nullable=False)
    loss = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=True)
    extra_metrics_json = Column(JSON, default=dict, nullable=False)
    logged_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    experiment_run = relationship("ExperimentRun", back_populates="metrics_history")

class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True, index=True)
    experiment_run_id = Column(String(36), ForeignKey("experiment_runs.id", ondelete="CASCADE"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    artifact_type = Column(String(50), nullable=False)  # weights, metrics_plot, dataset, code_snippet
    file_path = Column(String(512), nullable=True)
    metadata_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    experiment_run = relationship("ExperimentRun", back_populates="artifacts")
