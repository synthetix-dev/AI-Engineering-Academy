import uuid
import time
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from app.models.data_ml import ExperimentRun
from app.schemas.experiments import ExperimentRunCreate, ExperimentRunResponse
from app.api.deps import get_current_user
from app.engines.dispatcher import dispatch_lab_execution

router = APIRouter(prefix="/experiments", tags=["Experiments"])

TRACK_SLUG_MAP = {
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
    "ai-product-engineering": "capstone-design-lab",
}

@router.post("/run", response_model=ExperimentRunResponse)
async def run_experiment(
    payload: ExperimentRunCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lab_slug = TRACK_SLUG_MAP.get(payload.track_slug, payload.track_slug)
    
    # Run real numerical / ML computation
    result = await dispatch_lab_execution(lab_slug, payload.parameters)

    run_id = str(uuid.uuid4())
    run = ExperimentRun(
        id=run_id,
        user_id=current_user.id,
        project_id=payload.project_id,
        run_name=payload.run_name or f"Run {payload.track_slug}",
        track_slug=payload.track_slug,
        parameters_json=payload.parameters,
        metrics_json=result.get("metrics", {}),
        artifacts_json=result.get("artifacts", {}),
        execution_time_sec=result.get("execution_time_sec", 0.0)
    )
    db.add(run)
    await db.commit()

    return ExperimentRunResponse(
        id=run_id,
        track_slug=payload.track_slug,
        run_name=run.run_name,
        success=result.get("success", True),
        parameters=payload.parameters,
        metrics=result.get("metrics", {}),
        artifacts=result.get("artifacts", {}),
        execution_time_sec=result.get("execution_time_sec", 0.0),
        error=result.get("error")
    )
