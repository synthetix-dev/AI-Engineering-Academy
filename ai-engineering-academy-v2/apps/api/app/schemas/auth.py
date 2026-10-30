from typing import Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str
    role: str
    career_goal: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    career_goal: Optional[str] = "ai_engineer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    career_goal: Optional[str] = None
    theme: Optional[str] = None
    auto_inspect_code: Optional[bool] = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    career_goal: str
    xp: int
    level: int
    created_at: str

    class Config:
        from_attributes = True
