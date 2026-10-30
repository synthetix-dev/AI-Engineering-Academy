import asyncio
import json
import logging
from datetime import datetime, timezone
from sqlalchemy import select

from backend.app.core.database import async_session_maker
from backend.app.core.redis_client import get_redis_client, publish_run_event
from backend.app.models.run import Run
from backend.app.models.enums import RunStatus, RunErrorCode
from backend.app.models.quota import Quota
from backend.app.engines import dispatcher
from backend.app.core.security import sanitize_json

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(levelname)s] [Worker] %(message)s")
logger = logging.getLogger("worker")

async def process_run_job(job_payload: dict):
    run_id = job_payload["run_id"]
    lab_slug = job_payload["lab_slug"]
    params = job_payload.get("params", {})
    user_id = job_payload["user_id"]

    logger.info(f"Processing run {run_id} for lab '{lab_slug}' (User: {user_id})")

    async with async_session_maker() as db:
        stmt = select(Run).where(Run.id == run_id)
        res = await db.execute(stmt)
        run_record = res.scalar_one_or_none()
        if not run_record:
            logger.error(f"Run {run_id} not found in database.")
            return

        run_record.status = RunStatus.RUNNING
        run_record.started_at = datetime.now(timezone.utc)
        await db.commit()

        await publish_run_event(str(run_id), {
            "event_type": "status_change",
            "status": "RUNNING",
            "message": f"Worker picked up run {run_id}."
        })

        try:
            execution_result = await dispatcher.dispatch_lab_execution(lab_slug, params)
            exec_duration = execution_result["execution_time_sec"]

            run_record.finished_at = datetime.now(timezone.utc)
            if execution_result["success"]:
                run_record.status = RunStatus.SUCCEEDED
                run_record.metrics = sanitize_json(execution_result["metrics"])
                run_record.artifacts = sanitize_json(execution_result["artifacts"])
                run_record.resource_usage = sanitize_json({
                    "cpu_seconds": exec_duration,
                    "memory_mb": 128.0
                })

                q_stmt = select(Quota).where(Quota.user_id == user_id)
                q_res = await db.execute(q_stmt)
                quota = q_res.scalar_one_or_none()
                if quota:
                    quota.cpu_seconds_used += exec_duration

                await publish_run_event(str(run_id), {
                    "event_type": "status_change",
                    "status": "SUCCEEDED",
                    "metrics": run_record.metrics,
                    "duration_sec": exec_duration
                })
                logger.info(f"Run {run_id} succeeded in {exec_duration}s.")
            else:
                run_record.status = RunStatus.FAILED
                run_record.error_code = RunErrorCode.INTERNAL
                run_record.error_message = execution_result.get("error", "Worker execution failed")
                await publish_run_event(str(run_id), {
                    "event_type": "status_change",
                    "status": "FAILED",
                    "error": run_record.error_message
                })
                logger.warning(f"Run {run_id} failed: {run_record.error_message}")

        except Exception as e:
            run_record.status = RunStatus.FAILED
            run_record.error_code = RunErrorCode.INTERNAL
            run_record.error_message = str(e)
            run_record.finished_at = datetime.now(timezone.utc)
            await publish_run_event(str(run_id), {
                "event_type": "status_change",
                "status": "FAILED",
                "error": str(e)
            })
            logger.error(f"Exception during run {run_id}: {str(e)}")

        await db.commit()

async def main():
    logger.info("AI Engineering Academy Dedicated Worker started. Listening for tasks...")
    redis = get_redis_client()
    queue_name = "ai_academy_jobs"

    while True:
        try:
            # Pop job from Redis list with timeout
            item = await redis.blpop(queue_name, timeout=2)
            if item:
                _, payload_raw = item
                payload = json.loads(payload_raw)
                await process_run_job(payload)
        except asyncio.CancelledError:
            logger.info("Worker shutting down gracefully...")
            break
        except Exception as e:
            logger.error(f"Error in worker loop: {e}")
            await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
