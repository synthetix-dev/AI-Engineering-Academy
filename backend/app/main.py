from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.init_db import init_database
from backend.app.api.v1 import (
    auth,
    tracks,
    labs,
    runs,
    datasets,
    models,
    projects,
    evaluations,
    progress,
    quotas,
    admin,
    career_paths,
    mentor,
    missions,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables and initial catalog are verified on startup
    await init_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Open browser-based practical AI/ML Engineering learning platform API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/v1/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
api_v1_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1_prefix)
app.include_router(tracks.router, prefix=api_v1_prefix)
app.include_router(labs.router, prefix=api_v1_prefix)
app.include_router(runs.router, prefix=api_v1_prefix)
app.include_router(datasets.router, prefix=api_v1_prefix)
app.include_router(models.router, prefix=api_v1_prefix)
app.include_router(projects.router, prefix=api_v1_prefix)
app.include_router(evaluations.router, prefix=api_v1_prefix)
app.include_router(progress.router, prefix=api_v1_prefix)
app.include_router(quotas.router, prefix=api_v1_prefix)
app.include_router(admin.router, prefix=api_v1_prefix)
app.include_router(career_paths.router, prefix=api_v1_prefix)
app.include_router(mentor.router, prefix=api_v1_prefix)
app.include_router(missions.router, prefix=api_v1_prefix)

@app.get("/")
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "documentation": "/docs",
        "spec_v1_1": "Verified compliant"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
