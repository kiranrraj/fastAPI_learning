# app/models/user.py

from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

# Pydantic v2-compatible ObjectId wrapper
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]

# Embedded document: Entity access control
class EntityAccess(BaseModel):
    name: str
    read: bool
    write: bool

# Embedded document: User preferences
class Preferences(BaseModel):
    favorite_portlets: List[str] = Field(default_factory=list)
    theme: Optional[str] = None
    default_page: Optional[str] = None
    last_opened_tabs: List[str] = Field(default_factory=list)
    active_tab: Optional[str] = None
    last_closed_tab: Optional[str] = None

# Base user schema (shared across create/update/read)
class UserBase(BaseModel):
    username: str = Field(..., examples=["user1"])
    email: EmailStr = Field(..., examples=["user1@example.com"])
    role: str = Field(..., examples=["admin"])
    entity_access: List[EntityAccess] = Field(default_factory=list)
    preferences: Preferences = Field(default_factory=Preferences)

# Input model for user creation
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, examples=["adminA12"])

# Input model for user updates (PATCH/PUT)
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    entity_access: Optional[List[EntityAccess]] = None
    preferences: Optional[Preferences] = None
    password: Optional[str] = Field(None, min_length=8)

# Output model for user document from MongoDB
class UserModel(UserBase):
    id: PyObjectId = Field(alias="_id")

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "id": "665faefc197dbd2dd51efabc",
                "username": "user1",
                "email": "user1@example.com",
                "role": "admin",
                "entity_access": [{"name": "lab", "read": True, "write": False}],
                "preferences": {
                    "theme": "dark",
                    "favorite_portlets": [],
                    "default_page": "dashboard"
                }
            }
        }
    }
