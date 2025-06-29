from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

# 1. Entity-level access
class EntityAccess(BaseModel):
    name: str
    read: bool
    write: bool
    delete: bool

# 2. Default tab/page state
class DefaultPage(BaseModel):
    groups: List[str]
    tabs: List[str]
    activeTab: Optional[str] = None

# 3. User UI/UX preferences
class Preferences(BaseModel):
    favorites: List[str]
    theme: str
    defaultPage: DefaultPage
    lastOpenedTabs: List[str]
    activeTab: Optional[str] = None
    lastClosedTabs: List[str]

# 4. Notifications structure
class Notification(BaseModel):
    id: str
    message: str
    time: datetime
    closed: bool
    read: bool

# 5. The full MongoDB user model
class UserInDB(BaseModel):
    id: str = Field(alias="_id")
    username: str
    email: str
    role: str
    password: str
    entity_access: List[EntityAccess]
    preferences: Preferences
    notifications: List[Notification]
    created_at: datetime
    updated_at: datetime

# 6. Login input schema
class LoginRequest(BaseModel):
    email: str
    password: str
