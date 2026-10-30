import hashlib
import time
from typing import Dict, Any
from fastapi import APIRouter, Depends
from app.schemas.challenges import EvaluationResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/evaluations", tags=["Evaluation Engine"])

@router.post("/run", response_model=EvaluationResponse)
async def run_evaluation(
    payload: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    start = time.perf_counter()
    task_id = payload.get("task_id", "task-ml-benchmark")
    dataset_id = payload.get("dataset_id", "ds-hidden-eval-500")
    candidate_metrics = payload.get("candidate_metrics", {"accuracy": 0.92, "f1_score": 0.91})

    # Deterministic criteria verification
    passed = candidate_metrics.get("accuracy", 0) >= 0.85
    duration_ms = (time.perf_counter() - start) * 1000

    det_hash = hashlib.sha256(f"{task_id}:{dataset_id}:{passed}".encode()).hexdigest()[:16]

    return EvaluationResponse(
        id=f"eval-{int(time.time())}",
        task_id=task_id,
        dataset_id=dataset_id,
        metrics={k: float(v) for k, v in candidate_metrics.items() if isinstance(v, (int, float))},
        passed=passed,
        deterministic_hash=det_hash,
        execution_time_ms=round(duration_ms, 2)
    )
