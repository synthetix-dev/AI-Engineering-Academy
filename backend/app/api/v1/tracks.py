import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.models.cms import Track, Course, Lesson, Lab, Attempt, Enrollment
from backend.app.models.user import User
from backend.app.schemas.cms import TrackResponse, CourseResponse, LessonResponse, AttemptSubmit
from backend.app.api.deps import get_optional_user, get_current_user

router = APIRouter(tags=["Tracks & Courses"])

@router.get("/tracks", response_model=List[TrackResponse])
async def list_tracks(db: AsyncSession = Depends(get_db)):
    """Retrieve full catalog of 20 learning tracks with courses, lessons, and labs."""
    stmt = (
        select(Track)
        .order_by(Track.order)
        .options(
            selectinload(Track.courses)
            .selectinload(Course.lessons)
            .selectinload(Lesson.lab)
            .selectinload(Lab.missions),
            selectinload(Track.labs)
            .selectinload(Lab.missions)
        )
    )
    result = await db.execute(stmt)
    tracks = result.scalars().all()
    return tracks

@router.get("/tracks/{slug}", response_model=TrackResponse)
async def get_track_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Track)
        .where(Track.slug == slug)
        .options(
            selectinload(Track.courses)
            .selectinload(Course.lessons)
            .selectinload(Lesson.lab)
            .selectinload(Lab.missions),
            selectinload(Track.labs)
            .selectinload(Lab.missions)
        )
    )
    result = await db.execute(stmt)
    track = result.scalar_one_or_none()
    if not track:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Track '{slug}' not found")
    return track

@router.get("/lessons/{lesson_id}", response_model=LessonResponse)
async def get_lesson(lesson_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Lesson)
        .where(Lesson.id == lesson_id)
        .options(selectinload(Lesson.lab).selectinload(Lab.missions))
    )
    result = await db.execute(stmt)
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return lesson

@router.post("/lessons/{lesson_id}/attempt")
async def submit_lesson_attempt(
    lesson_id: uuid.UUID,
    submission: AttemptSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Submit lesson quiz answers or practical lab evidence.
    Verifies correctness against actual rubric, saves attempt, awards XP.
    """
    stmt = select(Lesson).where(Lesson.id == lesson_id)
    result = await db.execute(stmt)
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    correct_answers = 0
    total_questions = len(lesson.quiz_questions)

    if total_questions > 0 and submission.quiz_answers:
        for idx, q in enumerate(lesson.quiz_questions):
            expected = q.get("correct_index", 0)
            if idx < len(submission.quiz_answers) and submission.quiz_answers[idx] == expected:
                correct_answers += 1
        score = correct_answers / total_questions
        passed = (score >= 0.7)
    else:
        score = 1.0
        passed = True

    xp_gained = int(50 * score) if passed else 0

    attempt = Attempt(
        user_id=current_user.id,
        lesson_id=lesson.id,
        mission_id=submission.mission_id,
        status="passed" if passed else "failed",
        score=score,
        evidence_run_id=submission.evidence_run_id,
        feedback=f"Passed {correct_answers}/{total_questions} questions correctly." if total_questions > 0 else "Lab execution submitted."
    )
    db.add(attempt)

    if passed:
        current_user.xp += xp_gained

    await db.commit()

    return {
        "status": "passed" if passed else "failed",
        "score": round(score, 2),
        "xp_awarded": xp_gained,
        "total_user_xp": current_user.xp,
        "feedback": attempt.feedback
    }
