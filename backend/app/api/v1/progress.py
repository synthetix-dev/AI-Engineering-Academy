from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.models.cms import Attempt, Enrollment
from backend.app.models.skill import UserMastery, Achievement, Skill
from backend.app.models.run import Run
from backend.app.models.user import User
from backend.app.schemas.common import ProgressResponse, UserMasteryResponse
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/me", tags=["Learner Progress"])

@router.get("/progress", response_model=ProgressResponse)
async def get_my_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Real-time verifiable progress and mastery statistics.
    No fake numbers or mock activity.
    """
    # Count passed attempts
    stmt_attempts = select(func.count(Attempt.id)).where(
        Attempt.user_id == current_user.id, Attempt.status == "passed"
    )
    passed_attempts_count = (await db.execute(stmt_attempts)).scalar() or 0

    # Recent runs
    stmt_runs = (
        select(Run)
        .where(Run.user_id == current_user.id)
        .order_by(Run.created_at.desc())
        .limit(5)
    )
    runs_res = (await db.execute(stmt_runs)).scalars().all()
    recent_runs_data = [
        {
            "run_id": str(r.id),
            "lab_id": str(r.lab_id),
            "status": r.status.value,
            "mode": r.execution_mode.value,
            "created_at": r.created_at.isoformat(),
            "metrics": r.metrics
        }
        for r in runs_res
    ]

    # Masteries
    stmt_masteries = (
        select(UserMastery, Skill)
        .join(Skill, UserMastery.skill_id == Skill.id)
        .where(UserMastery.user_id == current_user.id)
    )
    masteries_res = (await db.execute(stmt_masteries)).all()
    masteries_data = [
        UserMasteryResponse(
            skill_id=m.skill_id,
            skill_title=s.title,
            mastery_level=m.mastery_level.value,
            issued_at=m.issued_at,
            evidence_run_id=m.evidence_run_id
        )
        for m, s in masteries_res
    ]

    return ProgressResponse(
        total_xp=current_user.xp,
        streak_days=current_user.streak_days,
        completed_lessons_count=passed_attempts_count,
        passed_missions_count=passed_attempts_count,
        mastered_skills_count=len(masteries_data),
        recent_runs=recent_runs_data,
        masteries=masteries_data
    )
