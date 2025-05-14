from pydantic import BaseModel, Field
from typing import Annotated

class UserModel(BaseModel):
    username: Annotated[str, Field(min_length=3)]
    password: Annotated[str, Field(min_length=5)]
    role: str = "doctor"
