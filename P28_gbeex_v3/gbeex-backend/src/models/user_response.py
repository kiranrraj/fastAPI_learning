from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from src.models.user_model import EntityAccess, Preferences, Notification

# 1. Basic public-facing user info (safe to expose)
class UserPublic(BaseModel):
    id: str
    username: str
    email: str
    role: str
    entity_access: List[EntityAccess]
    preferences: Optional[Preferences] = None

# 2. Detailed user info including notifications
class UserProfile(UserPublic):
    notifications: List[Notification]
    created_at: datetime
    updated_at: datetime

# 3. Response for login, token refresh, etc.
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: UserPublic
