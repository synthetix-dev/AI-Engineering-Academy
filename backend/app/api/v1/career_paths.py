from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.cms import Track, Enrollment
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/career-paths", tags=["Career Paths & Onboarding"])

CAREER_PATHS_DATA = [
    {
        "slug": "ai-engineer",
        "title": "AI Engineer (Full-Stack)",
        "tagline": "Від фундаментальної математики до автономних агентів та production систем",
        "description": "Повний інженерний трек для розробки прикладних систем ШІ. Охоплює повний цикл: робота з даними, створення та тренування класичних та глибоких моделей, промпт-інжиніринг, RAG з векторними базами та розгортання ReAct-агентів.",
        "icon": "cpu",
        "level": "intermediate",
        "estimated_hours": 120,
        "role_focus": "AI Software Engineer / AI Solution Architect",
        "track_slugs": [
            "foundations", "mathematics-for-ai", "data-engineering", "classical-ml",
            "deep-learning", "transformers-nlp", "prompt-engineering", "rag-systems",
            "autonomous-agents", "mlops-monitoring"
        ],
        "milestones": [
            {"title": "Data & ML Core", "description": "Побудова відтворюваного ML пайплайну на scikit-learn", "xp": 300},
            {"title": "Neural Architectures", "description": "Навчання CNN/Transformer на власному датасеті", "xp": 500},
            {"title": "Modern GenAI & RAG", "description": "Гібридний векторний пошук з pgvector та ReAct агент", "xp": 750}
        ]
    },
    {
        "slug": "ml-engineer",
        "title": "Machine Learning Engineer",
        "tagline": "Математична глибина, оптимізація моделей та високонавантажений MLOps",
        "description": "Спеціалізація на навчанні, валідації та масштабуванні моделей машинного та глибокого навчання. Фокус на виявленні Data Leakage, тюнінгу гіперпараметрів, квантизації та трекінгу дрейфу даних (KS-тест).",
        "icon": "activity",
        "level": "intermediate",
        "estimated_hours": 100,
        "role_focus": "ML Engineer / Applied Data Scientist",
        "track_slugs": [
            "foundations", "mathematics-for-ai", "data-engineering", "classical-ml",
            "deep-learning", "computer-vision", "transformers-nlp", "model-optimization",
            "mlops-monitoring", "capstone-production"
        ],
        "milestones": [
            {"title": "Statistical Foundations", "description": "Матричний аналіз та градієнтна оптимізація", "xp": 350},
            {"title": "Deep Learning Master", "description": "PyTorch моделі та комп'ютерний зір", "xp": 600},
            {"title": "Production Deployment", "description": "CI/CD для ML та моніторинг деградації моделей", "xp": 800}
        ]
    },
    {
        "slug": "llm-engineer",
        "title": "LLM & Generative AI Engineer",
        "tagline": "Prompt Engineering, fine-tuning LoRA, RAG та оцінка безпеки",
        "description": "Спеціалізація на сучасних великих мовних моделях. Робота з контекстними вікнами, структурованим виводом JSON Schema, чанкінгом документів, LoRA адаптерами та guardrails безпеки.",
        "icon": "sparkles",
        "level": "advanced",
        "estimated_hours": 90,
        "role_focus": "LLM Engineer / GenAI Specialist",
        "track_slugs": [
            "foundations", "transformers-nlp", "prompt-engineering", "rag-systems",
            "fine-tuning", "autonomous-agents", "llm-evaluation", "safety-alignment"
        ],
        "milestones": [
            {"title": "Prompt Crafting & Schemas", "description": "Structured JSON outputs та тест-кейси регресії", "xp": 400},
            {"title": "Advanced RAG Pipeline", "description": "Гібридний пошук BM25 + pgvector з перевіркою цитувань", "xp": 600},
            {"title": "LoRA Fine-Tuning & Safety", "description": "Адаптація вагів моделі та захист від джейлбрейків", "xp": 850}
        ]
    },
    {
        "slug": "research-engineer",
        "title": "AI Research Engineer",
        "tagline": "Алгоритмічна глибина, RL, генеративні дифузійні моделі та безпека",
        "description": "Для інженерів та науковців, які досліджують нові архітектури. Включає математичні доведення, навчання з підкріпленням (Q-learning/PPO), генеративні моделі та Capstone дослідження.",
        "icon": "terminal",
        "level": "expert",
        "estimated_hours": 140,
        "role_focus": "Research Scientist / Algorithm Engineer",
        "track_slugs": [
            "mathematics-for-ai", "deep-learning", "transformers-nlp", "generative-ai",
            "reinforcement-learning", "optimization-hardware", "research-methods",
            "safety-alignment", "capstone-production"
        ],
        "milestones": [
            {"title": "Mathematical Rigor", "description": "Аналіз опуклої оптимізації та латентних просторів", "xp": 450},
            {"title": "Generative & RL Core", "description": "Навчання агента в Gymnasium та автоенкодери", "xp": 700},
            {"title": "Novel Capstone Study", "description": "Відтворюваний науково-інженерний експеримент", "xp": 1000}
        ]
    },
    {
        "slug": "ai-integrator",
        "title": "AI Integrator & Automation",
        "tagline": "Швидка автоматизація бізнес-процесів за допомогою ШІ та API",
        "description": "Фокус на швидкій інтеграції готових моделей у веб-сервіси, побудові DAG-автоматизацій, інтеграції CRM, поштових систем, баз знань та впровадженні агента без написання надлишкового коду.",
        "icon": "zap",
        "level": "beginner",
        "estimated_hours": 60,
        "role_focus": "AI Automation Specialist / Solutions Integrator",
        "track_slugs": [
            "foundations", "prompt-engineering", "rag-systems", "workflow-automation",
            "autonomous-agents", "llm-evaluation"
        ],
        "milestones": [
            {"title": "Foundations & Prompts", "description": "Базовий Python та системний промпт-дизайн", "xp": 250},
            {"title": "Automated Workflows", "description": "Створення DAG пайплайнів з тригерами", "xp": 450},
            {"title": "Multi-Tool Agent", "description": "Автономний агент з інструментами календаря і пошти", "xp": 650}
        ]
    },
    {
        "slug": "mlops-engineer",
        "title": "MLOps & Platform Engineer",
        "tagline": "Інфраструктура навчання, CI/CD, моніторинг дрейфу та реєстри моделей",
        "description": "Спеціалізація на надійній інфраструктурі для ШІ. Автоматизація перенавчання, валідація артефактів, реєстр версій моделей, моніторинг латентності та виявлення Data Drift.",
        "icon": "layers",
        "level": "intermediate",
        "estimated_hours": 80,
        "role_focus": "MLOps Engineer / Platform Engineer",
        "track_slugs": [
            "foundations", "data-engineering", "classical-ml", "model-optimization",
            "mlops-monitoring", "safety-alignment", "capstone-production"
        ],
        "milestones": [
            {"title": "Data Pipeline Control", "description": "Автоматичний аудит витоку даних та PII", "xp": 300},
            {"title": "Hardware Optimization", "description": "Квантизація int8 та оптимізація графу обчислень", "xp": 500},
            {"title": "Continuous MLOps", "description": "Реєстр моделей з перевіркою KS-дрейфу", "xp": 750}
        ]
    }
]

class OnboardingRequest(BaseModel):
    career_path: str
    level: str  # beginner, intermediate, advanced
    interests: List[str] = []
    answers: Dict[str, Any] = {}

class CareerPathResponse(BaseModel):
    slug: str
    title: str
    tagline: str
    description: str
    icon: str
    level: str
    estimated_hours: int
    role_focus: str
    track_slugs: List[str]
    milestones: List[Dict[str, Any]]

@router.get("", response_model=List[CareerPathResponse])
async def list_career_paths():
    """List all official curated Career Pathways."""
    return CAREER_PATHS_DATA

@router.get("/{slug}", response_model=CareerPathResponse)
async def get_career_path(slug: str):
    """Get details of a specific Career Pathway."""
    for path in CAREER_PATHS_DATA:
        if path["slug"] == slug:
            return path
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Career path '{slug}' not found")

@router.post("/onboarding")
async def complete_onboarding(
    req: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Complete user onboarding assessment:
    - Save career goals and diagnostic level
    - Auto-enroll user in the primary starting track of the selected path
    - Grant initial welcome XP (100 XP)
    """
    target_path = next((p for p in CAREER_PATHS_DATA if p["slug"] == req.career_path), None)
    if not target_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid career path selected")

    # Update user XP and metadata
    current_user.xp += 100
    if current_user.streak_days == 0:
        current_user.streak_days = 1

    # Enroll user into first track of selected career path
    first_track_slug = target_path["track_slugs"][0]
    track_stmt = select(Track).where(Track.slug == first_track_slug)
    track_res = await db.execute(track_stmt)
    track = track_res.scalar_one_or_none()

    if track:
        # Check existing enrollment
        enroll_stmt = select(Enrollment).where(
            Enrollment.user_id == current_user.id,
            Enrollment.track_id == track.id
        )
        enroll_res = await db.execute(enroll_stmt)
        if not enroll_res.scalar_one_or_none():
            enrollment = Enrollment(
                user_id=current_user.id,
                track_id=track.id,
                status="in_progress"
            )
            db.add(enrollment)

    await db.commit()
    await db.refresh(current_user)

    return {
        "success": True,
        "message": f"Ласкаво просимо на трек '{target_path['title']}'! Вам нараховано 100 XP.",
        "career_path": target_path["slug"],
        "starting_track": first_track_slug,
        "recommended_tracks": target_path["track_slugs"]
    }
