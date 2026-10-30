import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class RAGCollection(Base):
    __tablename__ = "rag_collections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    embedding_model = Column(String(100), default="sentence-transformers/all-MiniLM-L6-v2", nullable=False)
    chunk_size = Column(Integer, default=250, nullable=False)
    chunk_overlap = Column(Integer, default=50, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    documents = relationship("RAGDocument", back_populates="collection", cascade="all, delete-orphan")

class RAGDocument(Base):
    __tablename__ = "rag_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    collection_id = Column(String(36), ForeignKey("rag_collections.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    chunk_count = Column(Integer, default=0, nullable=False)
    metadata_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    collection = relationship("RAGCollection", back_populates="documents")

class AgentConfig(Base):
    __tablename__ = "agent_configs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    system_role = Column(Text, nullable=False)
    allowed_tools_json = Column(JSON, default=list, nullable=False)
    max_iterations = Column(Integer, default=5, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    runs = relationship("AgentRun", back_populates="agent_config", cascade="all, delete-orphan")

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_config_id = Column(String(36), ForeignKey("agent_configs.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    task_input = Column(Text, nullable=False)
    status = Column(String(50), default="completed", nullable=False)  # running, completed, error, waiting_approval
    steps_trace_json = Column(JSON, default=list, nullable=False)
    final_output = Column(Text, nullable=False)
    execution_time_ms = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    agent_config = relationship("AgentConfig", back_populates="runs")
