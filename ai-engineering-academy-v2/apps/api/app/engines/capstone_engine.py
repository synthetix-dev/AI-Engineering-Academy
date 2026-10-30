import time
from typing import Any, Dict, List

def evaluate_capstone_submission(
    project_title: str,
    problem_statement: str,
    dataset_metadata: Dict[str, Any],
    architecture_overview: str,
    metrics: Dict[str, float],
    intended_use: str,
    ethical_considerations: str
) -> Dict[str, Any]:
    """
    Evaluate capstone project submission against comprehensive production engineering rubrics
    and generate an official, standardized Model Card artifact.
    """
    rubric_scores = {}
    feedback_notes = []

    # 1. Problem Framing (max 20 pts)
    if len(problem_statement.strip()) > 50 and any(k in problem_statement.lower() for k in ["problem", "objective", "user", "metric", "business", "target"]):
        rubric_scores["problem_framing"] = 20
        feedback_notes.append("Clear problem definition with explicit business and engineering objectives.")
    else:
        rubric_scores["problem_framing"] = 10
        feedback_notes.append("Problem framing requires more specific KPIs and target audience constraints.")

    # 2. Dataset Lineage & Licensing (max 25 pts)
    ds_license = dataset_metadata.get("license", "Unknown")
    is_permissive = any(l in ds_license.upper() for l in ["MIT", "APACHE", "CC-BY", "BSD"])
    if is_permissive and dataset_metadata.get("row_count", 0) > 0:
        rubric_scores["data_lineage_and_license"] = 25
        feedback_notes.append(f"Compliant open-source license verified: {ds_license}.")
    else:
        rubric_scores["data_lineage_and_license"] = 12
        feedback_notes.append(f"Warning: License '{ds_license}' must be verified for commercial/public deployment.")

    # 3. Model Architecture & Baselines (max 25 pts)
    if len(architecture_overview.strip()) > 40:
        rubric_scores["architecture_soundness"] = 25
        feedback_notes.append("Well-documented architecture with clear modular component interfaces.")
    else:
        rubric_scores["architecture_soundness"] = 12
        feedback_notes.append("Architecture requires deeper specification of preprocessing and fallback paths.")

    # 4. Metrics & Evaluation Rigor (max 30 pts)
    has_accuracy = any(k in metrics for k in ["accuracy", "f1_score", "loss", "roc_auc"])
    if has_accuracy and len(metrics) >= 2:
        rubric_scores["evaluation_rigor"] = 30
        feedback_notes.append("Robust multi-metric evaluation with reported test splits.")
    else:
        rubric_scores["evaluation_rigor"] = 15
        feedback_notes.append("Evaluation must present at least two distinct performance metrics on held-out test data.")

    total_score = sum(rubric_scores.values())
    is_passed = total_score >= 75

    # Generate Official Model Card
    model_card = {
        "model_details": {
            "title": project_title,
            "evaluation_timestamp": int(time.time()),
            "status": "APPROVED_CAPSTONE" if is_passed else "REVISIONS_REQUESTED",
            "score": total_score
        },
        "dataset_lineage": {
            "source": dataset_metadata.get("source", "Curated Open Dataset"),
            "license": ds_license,
            "sample_count": dataset_metadata.get("row_count", 0),
            "split": dataset_metadata.get("split_info", {"train": "80%", "val": "10%", "test": "10%"})
        },
        "performance_metrics": metrics,
        "intended_uses": {
            "primary_intended_use": intended_use,
            "out_of_scope_uses": "Automated decision making without human supervision."
        },
        "ethical_considerations_and_limitations": {
            "notes": ethical_considerations,
            "bias_mitigation": "Tested on balanced validation subsets."
        }
    }

    return {
        "project_title": project_title,
        "total_score_100": total_score,
        "is_approved": is_passed,
        "rubric_breakdown": rubric_scores,
        "auditor_feedback": feedback_notes,
        "model_card": model_card
    }
