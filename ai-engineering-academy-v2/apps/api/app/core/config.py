import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Engineering Academy 2.0 API"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-academy-v2-dev-key-change-in-production-123456")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database: defaults to SQLite with async support for seamless local dev & tests
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./academy_v2.db")
    
    # Redis / Valkey
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Resource quotas
    MAX_CONCURRENT_JOBS: int = 4
    MAX_JOB_EXECUTION_SECONDS: int = 300
    MAX_UPLOAD_SIZE_MB: int = 25
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
