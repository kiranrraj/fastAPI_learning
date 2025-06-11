# app/models/user.py
from typing import Optional, Literal
from pydantic import Field # Ensure Field is imported
from app.models.base import AppBaseModel, PyObjectId
from enum import Enum # NEW: For defining roles as an Enum

# NEW: Define user roles as an Enum for strict type checking and clarity
class Role(str, Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    TESTCENTER = "testcenter" # Corrected: "testCenter" -> "testcenter"
    USER = "user" # Assuming 'user' is the default general role

# Represents the complete structure of a user document as it is
# stored in your MongoDB database's users collection
class UserInDB(AppBaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None) # MongoDB's _id
    username: str = Field(..., min_length=3, max_length=50)
    hashed_password: str
    # Use the Enum for the role field
    role: Role # Corrected: Literal -> Role Enum

# UserCreate is designed specifically for validating the incoming data
# when a new user registers via an API endpoint. POST /auth/register
class UserCreate(AppBaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    # Default role for new registrations
    role: Role = Role.USER # Corrected: Literal -> Role Enum, default to USER

# UserLogin is a straightforward model for validating the incoming data
# when a user attempts to log in via an API endpoint. POST /auth/token
class UserLogin(AppBaseModel):
    username: str
    password: str

# UserData is specifically designed for representing user information
# that is safe to expose in API responses.
class UserData(AppBaseModel):
    id: PyObjectId = Field(alias="_id")
    username: str
    # Use the Enum for the role field
    role: Role # Corrected: str -> Role Enum