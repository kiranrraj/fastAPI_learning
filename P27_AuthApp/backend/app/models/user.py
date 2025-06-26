from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr

class EntityAccess(BaseModel):
    name: str
    read: bool
    write: bool

class Preferences(BaseModel):
    # Customize preference fields as needed; empty by default
    favorite_portlets: List[str] = Field(default_factory=list)
    theme: Optional[str] = None
    default_page: Optional[str] = None
    last_opened_tabs: List[str] = Field(default_factory=list)
    active_tab: Optional[str] = None
    last_closed_tab: Optional[str] = None

class UserBase(BaseModel):
    username: str = Field(..., example="user1")
    email: EmailStr = Field(..., example="user1@example.com")
    role: str = Field(..., example="admin")
    entity_access: List[EntityAccess] = Field(default_factory=list)
    preferences: Preferences = Field(default_factory=Preferences)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, example="adminA12")

class UserUpdate(BaseModel):
    # All fields optional for partial updates
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    entity_access: Optional[List[EntityAccess]] = None
    preferences: Optional[Preferences] = None
    password: Optional[str] = Field(None, min_length=8)

class UserModel(UserBase):
    id: str = Field(..., alias="id")
