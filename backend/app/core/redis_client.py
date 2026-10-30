import json
from typing import AsyncGenerator, Any
import redis.asyncio as aioredis
from backend.app.core.config import settings

_redis_pool: aioredis.Redis | None = None

def get_redis_client() -> aioredis.Redis:
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    return _redis_pool

async def get_redis() -> AsyncGenerator[aioredis.Redis, None]:
    client = get_redis_client()
    yield client

async def publish_run_event(run_id: str, event_data: dict[str, Any]) -> None:
    """Publish real-time telemetry or step event to Redis PubSub for SSE."""
    client = get_redis_client()
    channel = f"run_events:{run_id}"
    await client.publish(channel, json.dumps(event_data))
