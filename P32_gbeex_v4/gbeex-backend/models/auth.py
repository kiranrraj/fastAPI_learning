# models/auth.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class UserBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    staffId: str
    username: str
    email: str
    firstName: str
    lastName: str
    role: str
    position: str
    department: str
    location: str
    status: str
    createdAt: datetime
    updatedAt: datetime

class UserInDB(UserBase):
    passwordHash: bytes
    failedLoginAttempts: int = 0
    lockoutUntil: Optional[datetime] = None
    maxLoginAttempts: int = 5

class UserResponse(UserBase):
    pass