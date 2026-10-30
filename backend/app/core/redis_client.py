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

async def subscribe_to_run_events(run_id: str) -> AsyncGenerator[dict[str, Any], None]:
    """Subscribe to Redis PubSub channel for real-time SSE event streaming."""
    client = get_redis_client()
    channel = f"run_events:{run_id}"
    pubsub = client.pubsub()
    await pubsub.subscribe(channel)
    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                try:
                    data = json.loads(message["data"])
                    yield data
                except Exception:
                    yield {"raw": message["data"]}
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.close()
