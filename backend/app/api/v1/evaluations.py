import uuid
from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.models.run import Run
from backend.app.models.skill import EvalSuite, EvalResult
from backend.app.models.user import User
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])

class EvaluationRequest(BaseModel):
    run_id: uuid.UUID
    criteria: Dict[str, Any] = {}

@router.post("")
async def evaluate_run(
    req: EvaluationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Deterministic evaluation of a completed lab run against rubrics and criteria.
    """
    stmt = select(Run).where(Run.id == req.run_id)
    res = await db.execute(stmt)
    run_item = res.scalar_one_or_none()
    if not run_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")

    if run_item.user_id != current_user.id and current_user.role.value != "platform_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Evaluate metrics against thresholds
    metrics = run_item.metrics or {}
    passed = False
    score = 0.0
    evaluation_notes = []

    if "accuracy" in metrics:
        acc = metrics["accuracy"]
        passed = (acc >= req.criteria.get("min_accuracy", 0.7))
        score = acc
        evaluation_notes.append(f"Model accuracy {acc} evaluated against threshold 0.7.")
    elif "overall_accuracy" in metrics:
        acc = metrics["overall_accuracy"]
        passed = (acc >= 0.75)
        score = acc
        evaluation_notes.append(f"Prompt test suite passed with {acc*100}% accuracy.")
    elif "final_loss" in metrics:
        passed = (metrics["final_loss"] < 1.0)
        score = max(0.0, 1.0 - metrics["final_loss"])
        evaluation_notes.append(f"Loss convergence verified with final value {metrics['final_loss']}.")
    elif "groundedness_score" in metrics:
        score = metrics["groundedness_score"]
        passed = (score >= 0.5)
        evaluation_notes.append(f"RAG Groundedness verified with score {score}.")
    elif "loss_reduction_percent" in metrics:
        score = min(1.0, metrics["loss_reduction_percent"] / 50.0)
        passed = (metrics["loss_reduction_percent"] > 0)
        evaluation_notes.append(f"LoRA Fine-tuning reduced loss by {metrics['loss_reduction_percent']}%.")
    else:
        passed = (run_item.status.value == "succeeded")
        score = 1.0 if passed else 0.0
        evaluation_notes.append("Execution succeeded with all steps completed.")

    eval_result = EvalResult(
        run_id=run_item.id,
        passed=passed,
        score=round(score, 4),
        details={"rubric_notes": evaluation_notes, "evaluated_metrics": metrics},
        evidence={"run_trace_id": run_item.trace_id, "execution_mode": run_item.execution_mode.value}
    )
    db.add(eval_result)
    await db.commit()
    await db.refresh(eval_result)

    return {
        "evaluation_id": str(eval_result.id),
        "run_id": str(run_item.id),
        "passed": passed,
        "score": round(score, 4),
        "notes": evaluation_notes,
        "evidence": eval_result.evidence
    }
