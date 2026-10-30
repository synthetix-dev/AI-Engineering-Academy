import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=False)
    track_ids_json = Column(JSON, default=list, nullable=False)
    recommended_order_json = Column(JSON, default=list, nullable=False)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    level = Column(Integer, default=1, nullable=False)
    track_id = Column(String(100), nullable=False, index=True)
    verification_method = Column(String(50), default="deterministic_test", nullable=False)

class SkillPrerequisite(Base):
    __tablename__ = "skill_prerequisites"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    prerequisite_skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    level = Column(String(50), default="all_levels", nullable=False)

    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")

class Module(Base):
    __tablename__ = "modules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    sequence_order = Column(Integer, default=1, nullable=False)

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    module_id = Column(String(36), ForeignKey("modules.id", ondelete="CASCADE"), nullable=True, index=True)
    track_slug = Column(String(100), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    summary = Column(Text, nullable=False)
    content_json = Column(JSON, default=dict, nullable=False)

    module = relationship("Module", back_populates="lessons")
    activities = relationship("Activity", back_populates="lesson", cascade="all, delete-orphan")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lesson_id = Column(String(36), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_type = Column(String(50), nullable=False)  # discover_step, quiz, interactive_playground
    title = Column(String(255), nullable=False)
    config_json = Column(JSON, default=dict, nullable=False)
    sequence_order = Column(Integer, default=1, nullable=False)

    lesson = relationship("Lesson", back_populates="activities")
