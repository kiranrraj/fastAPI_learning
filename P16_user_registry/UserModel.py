from typing import Dict, List
from pydantic import BaseModel, Field
from enum import Enum


class AccessLevel(str, Enum):
    read = "read"
    write = "write"
    delete = "delete"

class UserModel(BaseModel):
    username: str = Field(..., min_length=4)
    password: str = Field(..., min_length=6)
    role: str
    access_level: List[AccessLevel] = Field(..., min_items=1)

users: Dict[int, UserModel] = {}