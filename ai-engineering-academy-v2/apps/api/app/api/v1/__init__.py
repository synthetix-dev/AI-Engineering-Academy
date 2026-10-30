from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.paths import router as paths_router
from app.api.v1.skills import router as skills_router
from app.api.v1.curriculum import router as curriculum_router
from app.api.v1.challenges import router as challenges_router
from app.api.v1.projects import router as projects_router
from app.api.v1.datasets import router as datasets_router
from app.api.v1.models import router as models_router
from app.api.v1.experiments import router as experiments_router
from app.api.v1.training_jobs import router as training_jobs_router
from app.api.v1.rag import router as rag_router
from app.api.v1.agents import router as agents_router
from app.api.v1.evaluations import router as evaluations_router
from app.api.v1.portfolio import router as portfolio_router
from app.api.v1.admin import router as admin_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(paths_router)
api_router.include_router(skills_router)
api_router.include_router(curriculum_router)
api_router.include_router(challenges_router)
api_router.include_router(projects_router)
api_router.include_router(datasets_router)
api_router.include_router(models_router)
api_router.include_router(experiments_router)
api_router.include_router(training_jobs_router)
api_router.include_router(rag_router)
api_router.include_router(agents_router)
api_router.include_router(evaluations_router)
api_router.include_router(portfolio_router)
api_router.include_router(admin_router)
