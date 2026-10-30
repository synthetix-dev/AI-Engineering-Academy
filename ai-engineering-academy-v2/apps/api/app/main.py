from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserPreferences
from app.models.projects import Project
from app.api.v1 import api_router

async def seed_initial_data():
    """Initializes tables and default demo & admin users with seed project."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if admin exists
        res = await session.execute(select(User).where(User.email == "admin@academy.ai"))
        if not res.scalars().first():
            admin = User(
                email="admin@academy.ai",
                hashed_password=get_password_hash("AdminSecret2026!"),
                full_name="AI Academy Admin",
                role="admin",
                career_goal="ai_engineer",
                xp=1000,
                level=5
            )
            session.add(admin)
            await session.flush()
            session.add(UserPreferences(user_id=admin.id, theme="light"))

        # Check if demo student exists
        res_student = await session.execute(select(User).where(User.email == "student@academy.ai"))
        student = res_student.scalars().first()
        if not student:
            student = User(
                email="student@academy.ai",
                hashed_password=get_password_hash("StudentSecret2026!"),
                full_name="Олександр AI Інженер",
                role="student",
                career_goal="ai_engineer",
                xp=150,
                level=1
            )
            session.add(student)
            await session.flush()
            session.add(UserPreferences(user_id=student.id, theme="light"))

            # Create default starter AI Companion project
            starter_project = Project(
                user_id=student.id,
                name="Мій Перший AI Companion",
                description="Персональний AI-помічник для вирішення інженерних задач та експериментів.",
                project_type="companion",
                evolution_level=1,
                version="1.0.0",
                attached_skills_json=["FOUNDATIONS_PYTHON", "PROMPT_ENGINEERING"],
                configuration_json={"temperature": 0.7, "system_role": "AI Engineer Assistant"},
                metrics_json={"accuracy": 0.92, "latency_ms": 45.2},
                status="trained"
            )
            session.add(starter_project)

        await session.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database and seeds
    await seed_initial_data()
    yield
    # Shutdown

app = FastAPI(
    title="AI Engineering Academy 2.0 API",
    version=settings.VERSION,
    description="REST API для інтерактивної платформи підготовки AI Engineers (20 напрямів, Discover-Create-Master).",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "platform": "AI Engineering Academy 2.0",
        "version": settings.VERSION,
        "language": "uk",
        "status": "operational",
        "api_docs": "/docs",
        "mode": "Browser-first + Server-assisted + Async Training"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "workers": "ready",
        "version": settings.VERSION
    }
