from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.challenges import UserSkillProgress
from app.schemas.curriculum import SkillResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/skills", tags=["Skill Graph"])

STATIC_SKILLS = [
    {"id": "skill-foundations-python", "code": "FOUNDATIONS_PYTHON", "name": "Python для AI & Чисельні Обчислення", "category": "Foundations", "description": "Векторизовані масиви, оптимізація пам'яті та асинхронність.", "level": 1, "prerequisite_ids": [], "track_id": "engineering-fundamentals", "verification_method": "deterministic_test"},
    {"id": "skill-math-gradients", "code": "MATH_GRADIENTS", "name": "Градієнтний спуск та Оптимізація", "category": "Mathematics", "description": "Часткові похідні, learning rate та ландшафт втрат.", "level": 2, "prerequisite_ids": ["skill-foundations-python"], "track_id": "mathematics-for-ai", "verification_method": "deterministic_test"},
    {"id": "skill-data-engineering", "code": "DATA_ENGINEERING", "name": "Підготовка та Очищення Датасетів", "category": "Data", "description": "IQR аномалії, пропуски, Z-score та запобігання data leakage.", "level": 2, "prerequisite_ids": ["skill-foundations-python"], "track_id": "data-engineering", "verification_method": "deterministic_test"},
    {"id": "skill-classical-ml", "code": "CLASSICAL_ML", "name": "Класичне Машинне Навчання", "category": "Machine Learning", "description": "Random Forest, Logistic Regression, Confusion Matrix та ROC-AUC.", "level": 2, "prerequisite_ids": ["skill-data-engineering", "skill-math-gradients"], "track_id": "machine-learning", "verification_method": "benchmark"},
    {"id": "skill-deep-learning", "code": "DEEP_LEARNING", "name": "Архітектура та Навчання Нейромереж", "category": "Deep Learning", "description": "Dense шари, ReLU/GELU, Backpropagation та оптимізатори.", "level": 3, "prerequisite_ids": ["skill-classical-ml"], "track_id": "deep-learning", "verification_method": "benchmark"},
    {"id": "skill-nlp-speech", "code": "NLP_SPEECH", "name": "Токенізація та Векторні Ембедінги", "category": "NLP", "description": "BPE/WordPiece, семантичні вектори та косинусна подібність.", "level": 2, "prerequisite_ids": ["skill-foundations-python"], "track_id": "nlp-speech", "verification_method": "deterministic_test"},
    {"id": "skill-computer-vision", "code": "COMPUTER_VISION", "name": "Комп'ютерний Зір & Згорткові Мережі", "category": "Computer Vision", "description": "Тензори зображень, ядра Sobel, MaxPool та CNN.", "level": 3, "prerequisite_ids": ["skill-deep-learning"], "track_id": "computer-vision", "verification_method": "benchmark"},
    {"id": "skill-generative-ai", "code": "GENERATIVE_AI", "name": "Механізм Self-Attention & Семплінг", "category": "Generative AI", "description": "Scaled Dot-Product Attention, Temperature, Top-p, Top-k.", "level": 3, "prerequisite_ids": ["skill-deep-learning", "skill-nlp-speech"], "track_id": "generative-ai", "verification_method": "deterministic_test"},
    {"id": "skill-llm-engineering", "code": "LLM_ENGINEERING", "name": "Inference, Контекст & Serving LLM", "category": "LLM", "description": "KV-cache, TTFT, Throughput та локальний інференс.", "level": 3, "prerequisite_ids": ["skill-generative-ai"], "track_id": "llm-engineering", "verification_method": "benchmark"},
    {"id": "skill-prompt-engineering", "code": "PROMPT_ENGINEERING", "name": "Структурований Промптинг & Валідація Схем", "category": "Prompting", "description": "System instructions, Few-Shot, JSON Schema, A/B тести.", "level": 2, "prerequisite_ids": ["skill-nlp-speech"], "track_id": "prompt-engineering", "verification_method": "deterministic_test"},
    {"id": "skill-rag-engineering", "code": "RAG_ENGINEERING", "name": "Векторний Пошук, Чанкінг & Grounding (RAG)", "category": "RAG", "description": "Чанкінг з overlap, індексація pgvector, косинусний пошук.", "level": 3, "prerequisite_ids": ["skill-nlp-speech", "skill-prompt-engineering"], "track_id": "rag-engineering", "verification_method": "evaluation_suite"},
    {"id": "skill-finetuning", "code": "FINETUNING", "name": "Fine-Tuning (LoRA & PEFT)", "category": "Training", "description": "Справжнє донавчання ваг/адаптерів LoRA та збереження чекпойнтів.", "level": 4, "prerequisite_ids": ["skill-deep-learning", "skill-generative-ai"], "track_id": "training-finetuning", "verification_method": "benchmark"},
    {"id": "skill-reinforcement-learning", "code": "REINFORCEMENT_LEARNING", "name": "Навчання з Підкріпленням & DPO", "category": "RL", "description": "Epsilon-Greedy бандити, винагороди, Q-learning.", "level": 4, "prerequisite_ids": ["skill-math-gradients", "skill-deep-learning"], "track_id": "reinforcement-learning", "verification_method": "benchmark"},
    {"id": "skill-ai-agents", "code": "AI_AGENTS", "name": "Автономні AI-Агенти & Tool Calling", "category": "Agents", "description": "ReAct цикл, виклик інструментів, пам'ять та безпека дій.", "level": 4, "prerequisite_ids": ["skill-prompt-engineering", "skill-rag-engineering"], "track_id": "ai-agents", "verification_method": "evaluation_suite"},
    {"id": "skill-automation-integrations", "code": "AUTOMATION_INTEGRATIONS", "name": "REST API, Webhooks & MCP Інтеграції", "category": "Integration", "description": "Ідемпотентні черги, експоненційний відкат та протокол MCP.", "level": 3, "prerequisite_ids": ["skill-foundations-python", "skill-ai-agents"], "track_id": "automation-integrations", "verification_method": "deterministic_test"},
    {"id": "skill-mlops", "code": "MLOPS", "name": "Моніторинг Дрифту Даних & Реєстр Моделей", "category": "MLOps", "description": "Тест Колмогорова-Смірнова, дрифт ознак, відкат версій.", "level": 3, "prerequisite_ids": ["skill-classical-ml", "skill-data-engineering"], "track_id": "mlops-llmops", "verification_method": "deterministic_test"},
    {"id": "skill-ai-safety", "code": "AI_SAFETY", "name": "Захист від Ін'єкцій & Фільтрація PII", "category": "Safety", "description": "Indirect Prompt Injection, маскування PII, права інструментів.", "level": 3, "prerequisite_ids": ["skill-prompt-engineering", "skill-ai-agents"], "track_id": "ai-safety", "verification_method": "evaluation_suite"},
    {"id": "skill-ai-optimization", "code": "AI_OPTIMIZATION", "name": "Квантизація (INT8/INT4) & Кешування", "category": "Optimization", "description": "Компресія ваг, масштабні коефіцієнти, оцінка Perplexity.", "level": 4, "prerequisite_ids": ["skill-llm-engineering"], "track_id": "ai-optimization", "verification_method": "benchmark"},
    {"id": "skill-ai-research", "code": "AI_RESEARCH", "name": "Абляційні Дослідження & Відтворюваність", "category": "Research", "description": "Ablation Study, Welch's t-test, відтворюваність експериментів.", "level": 4, "prerequisite_ids": ["skill-classical-ml", "skill-deep-learning"], "track_id": "ai-research", "verification_method": "evaluation_suite"},
    {"id": "skill-ai-product", "code": "AI_PRODUCT", "name": "Повний Життєвий Цикл AI-Продукту", "category": "Product", "description": "End-to-end інтеграція: Data + Model + RAG + Agent + Portfolio.", "level": 5, "prerequisite_ids": ["skill-rag-engineering", "skill-ai-agents", "skill-mlops"], "track_id": "ai-product-engineering", "verification_method": "evaluation_suite"}
]

@router.get("", response_model=List[SkillResponse])
async def list_skills():
    return [SkillResponse(**s) for s in STATIC_SKILLS]

@router.get("/user-progress")
async def get_user_skills(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(UserSkillProgress).where(UserSkillProgress.user_id == current_user.id))
    progress_rows = res.scalars().all()
    user_skill_map = {row.skill_id: row.status for row in progress_rows}

    result = []
    for s in STATIC_SKILLS:
        status = user_skill_map.get(s["id"], "available" if len(s["prerequisite_ids"]) == 0 else "locked")
        result.append({
            **s,
            "user_status": status
        })
    return result
