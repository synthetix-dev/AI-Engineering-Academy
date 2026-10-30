import json
from typing import Optional, Any
import redis.asyncio as redis
from app.core.config import settings

class InMemoryCache:
    def __init__(self):
        self._store = {}

    async def get(self, key: str) -> Optional[str]:
        return self._store.get(key)

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        self._store[key] = value
        return True

    async def setex(self, key: str, time: int, value: str) -> bool:
        self._store[key] = value
        return True

    async def delete(self, key: str) -> int:
        return 1 if self._store.pop(key, None) is not None else 0

_redis_client = None
_in_memory_fallback = InMemoryCache()

async def get_redis_client():
    global _redis_client
    if _redis_client is None:
        try:
            client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            await client.ping()
            _redis_client = client
        except Exception:
            _redis_client = _in_memory_fallback
    return _redis_client
