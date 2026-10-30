import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from backend.app.models.enums import UserRole

class UserRegister(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    email: str
    password: str
    full_name: str
    locale: str = "uk"

class UserLogin(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    email: str
    password: str

class Token(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    email: str
    full_name: str
    role: UserRole
    locale: str
    xp: int
    streak_days: int
    is_active: bool
    created_at: datetime
