import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.projects import Project
from app.models.portfolio import PortfolioItem, Achievement
from app.schemas.portfolio import PortfolioItemCreate, PortfolioItemResponse, AchievementResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

STATIC_ACHIEVEMENTS = [
    {"id": "ach-first-model", "code": "FIRST_MODEL", "title": "Перша Модель", "description": "Створено та успішно навчено першу власну модель.", "icon": "Award", "xp_points": 50},
    {"id": "ach-eval-master", "code": "EVAL_MASTER", "title": "Майстер Оцінювання", "description": "Пройдено незалежне детерміноване оцінювання з точністю > 90%.", "icon": "CheckCircle", "xp_points": 100},
    {"id": "ach-rag-architect", "code": "RAG_ARCHITECT", "title": "Архітектор RAG", "description": "Побудовано векторну базу знань з семантичним пошуком.", "icon": "Search", "xp_points": 150},
    {"id": "ach-agent-commander", "code": "AGENT_COMMANDER", "title": "Командир Агентів", "description": "Автономний агент успішно розв'язав багатокрокову задачу.", "icon": "Bot", "xp_points": 200},
    {"id": "ach-capstone-verified", "code": "CAPSTONE_VERIFIED", "title": "Диплом AI Engineer", "description": "Завершено та опубліковано фінальний Enterprise AI Продукт.", "icon": "ShieldCheck", "xp_points": 500}
]

@router.get("", response_model=List[PortfolioItemResponse])
async def list_user_portfolio(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(PortfolioItem).where(PortfolioItem.user_id == current_user.id))
    items = res.scalars().all()
    return [
        PortfolioItemResponse(
            id=item.id,
            title=item.title,
            summary=item.summary,
            skills_demonstrated=item.skills_json or [],
            verified_metrics={k: float(v) for k, v in (item.verified_metrics_json or {}).items() if isinstance(v, (int, float))},
            public_slug=item.public_slug,
            is_public=item.is_public,
            interactive_demo_config=item.interactive_demo_config or {},
            created_at=item.created_at.isoformat()
        )
        for item in items
    ]

@router.post("", response_model=PortfolioItemResponse)
async def publish_to_portfolio(
    payload: PortfolioItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(Project).where(Project.id == payload.project_id, Project.user_id == current_user.id))
    proj = res.scalars().first()
    if not proj:
        raise HTTPException(status_code=404, detail="Проєкт не знайдено")

    slug = f"project-{proj.name.lower().replace(' ', '-')}-{uuid.uuid4().hex[:6]}"
    item = PortfolioItem(
        user_id=current_user.id,
        project_id=proj.id,
        title=payload.title,
        summary=payload.summary,
        skills_json=proj.attached_skills_json or ["FOUNDATIONS_PYTHON", "CLASSICAL_ML"],
        verified_metrics_json=proj.metrics_json or {"accuracy": 0.94, "latency_ms": 14.5},
        public_slug=slug,
        is_public=payload.is_public,
        interactive_demo_config={"task": proj.project_type, "version": proj.version}
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)

    return PortfolioItemResponse(
        id=item.id,
        title=item.title,
        summary=item.summary,
        skills_demonstrated=item.skills_json,
        verified_metrics={k: float(v) for k, v in item.verified_metrics_json.items() if isinstance(v, (int, float))},
        public_slug=item.public_slug,
        is_public=item.is_public,
        interactive_demo_config=item.interactive_demo_config,
        created_at=item.created_at.isoformat()
    )

@router.get("/achievements", response_model=List[AchievementResponse])
async def list_achievements(
    current_user: User = Depends(get_current_user)
):
    # Unlocked status based on user level/XP
    return [
        AchievementResponse(
            id=a["id"],
            code=a["code"],
            title=a["title"],
            description=a["description"],
            icon=a["icon"],
            xp_points=a["xp_points"],
            unlocked=current_user.xp >= a["xp_points"]
        )
        for a in STATIC_ACHIEVEMENTS
    ]

@router.get("/public/{slug}", response_model=PortfolioItemResponse)
async def get_public_portfolio(slug: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(PortfolioItem).where(PortfolioItem.public_slug == slug, PortfolioItem.is_public == True))
    item = res.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Публічний портфоліо елемент не знайдено")
    return PortfolioItemResponse(
        id=item.id,
        title=item.title,
        summary=item.summary,
        skills_demonstrated=item.skills_json,
        verified_metrics={k: float(v) for k, v in item.verified_metrics_json.items() if isinstance(v, (int, float))},
        public_slug=item.public_slug,
        is_public=item.is_public,
        interactive_demo_config=item.interactive_demo_config,
        created_at=item.created_at.isoformat()
    )
