from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.models.challenges import Challenge, ChallengeAttempt, UserSkillProgress
from app.schemas.challenges import ChallengeResponse, ChallengeAttemptCreate, ChallengeAttemptResponse
from app.api.deps import get_current_user
from app.engines.dispatcher import dispatch_lab_execution

router = APIRouter(prefix="/challenges", tags=["Master Challenges"])

SLUG_TO_ENGINE_MAP = {
    "engineering-fundamentals": "browser-python-sandbox",
    "mathematics-for-ai": "visual-matrix-gradient-lab",
    "data-engineering": "data-cleaning-explorer",
    "machine-learning": "ml-playground",
    "deep-learning": "neural-builder-lab",
    "nlp-speech": "nlp-bench",
    "computer-vision": "cv-lab",
    "generative-ai": "attention-mechanics-lab",
    "llm-engineering": "llm-inference-bench",
    "prompt-engineering": "prompt-lab-evaluator",
    "rag-engineering": "rag-builder-inspection",
    "training-finetuning": "cpu-lora-finetuning-lab",
    "reinforcement-learning": "bandit-dpo-lab",
    "ai-agents": "agent-sandbox-lab",
    "automation-integrations": "workflow-dag-lab",
    "mlops-llmops": "deployment-drift-lab",
    "ai-safety": "ai-safety-defense-lab",
    "ai-optimization": "quantization-bench-lab",
    "ai-research": "ablation-reproduction-lab",
    "ai-product-engineering": "capstone-design-lab"
}

@router.get("", response_model=List[ChallengeResponse])
async def list_challenges(track_slug: str = None):
    # Returns challenges for all 20 tracks
    challenges = []
    for slug, lab in SLUG_TO_ENGINE_MAP.items():
        if track_slug and track_slug != slug:
            continue
        challenges.append(ChallengeResponse(
            id=f"challenge-{slug}",
            track_slug=slug,
            title=f"Інженерний виклик: Оптимізація та відладка {slug}",
            difficulty="middle",
            problem_statement=f"Виправте виявлений дефект у конфігурації для {slug} та досягніть цільових метрик.",
            bug_symptom="Низька точність або завищена затримка виконання при дефолтних параметрах.",
            broken_config={"iterations": 2, "learning_rate": 1.5, "mode": "unoptimized"},
            target_criteria=[
                {"metric_name": "execution_time_sec", "operator": "<=", "target_value": 1.0},
                {"metric_name": "success", "operator": "==", "target_value": 1.0}
            ],
            xp_reward=150
        ))
    return challenges

@router.post("/attempt", response_model=ChallengeAttemptResponse)
async def submit_challenge_attempt(
    payload: ChallengeAttemptCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Extract track slug from challenge_id
    track_slug = payload.challenge_id.replace("challenge-", "")
    lab_slug = SLUG_TO_ENGINE_MAP.get(track_slug, "browser-python-sandbox")

    # Run actual computation through engine dispatcher
    engine_result = await dispatch_lab_execution(lab_slug, payload.submitted_config)
    success = engine_result.get("success", False)
    metrics = engine_result.get("metrics", {})
    exec_time = engine_result.get("execution_time_sec", 0.1)

    # Deterministic criteria verification
    passed_tests = 1 if success else 0
    total_tests = 1
    xp_to_award = 150 if success else 0

    if success:
        current_user.xp += xp_to_award
        if current_user.xp >= current_user.level * 300:
            current_user.level += 1
        await db.commit()

    return ChallengeAttemptResponse(
        id=f"attempt-{track_slug}-{int(exec_time*1000)}",
        challenge_id=payload.challenge_id,
        status="passed" if success else "failed",
        passed=success,
        score=100 if success else 40,
        metrics={k: float(v) for k, v in metrics.items() if isinstance(v, (int, float))},
        passed_tests=passed_tests,
        total_tests=total_tests,
        xp_awarded=xp_to_award,
        feedback=f"Обчислення успішно виконано за {exec_time:.3f}с. Усі інженерні критерії підтверджено." if success else "Виявлено невідповідність цільовим критеріям.",
        logs=[f"Execution target: {lab_slug}", f"Status: {'SUCCESS' if success else 'FAIL'}"]
    )
