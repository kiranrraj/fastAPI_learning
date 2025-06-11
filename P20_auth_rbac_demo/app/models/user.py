# app/models/user.py
from typing import Optional, Literal
from pydantic import Field
from app.models.base import AppBaseModel, PyObjectId

# Represents the complete structure of a user document as it is 
# stored in your MongoDB database's users collection
class UserInDB(AppBaseModel):
    # It's optional because when you first create a user object in 
    # Python before inserting it into MongoDB, it won't have an _id 
    # yet. MongoDB generates this upon insertion.
    id: Optional[PyObjectId] = Field(alias="_id", default=None) # MongoDB's _id
    username: str = Field(..., min_length=3, max_length=50)
    hashed_password: str
    role: Literal["admin", "doctor", "testCenter", "user"]

# UserCreate is designed specifically for validating the incoming data 
# when a new user registers via an API endpoint. POST /auth/register
class UserCreate(AppBaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6) 
    role: Literal["admin", "doctor", "testCenter", "user"] = "user"

# UserLogin is a straightforward model for validating the incoming data 
# when a user attempts to log in via an API endpoint. POST /auth/token
class UserLogin(AppBaseModel):
    username: str
    password: str

# UserData is specifically designed for representing user information 
# that is safe to expose in API responses.
class UserData(AppBaseModel):
    # The user's MongoDB _id, aliased correctly. It's not Optional here 
    # because when returning user data, it must have an ID.
    id: PyObjectId = Field(alias="_id")
    username: str
    role: str