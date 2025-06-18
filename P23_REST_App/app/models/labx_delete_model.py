# app/models/labx_delete_models.py

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

class DeleteRequest(BaseModel):
    ids: List[str] = Field(..., description="List of JanusGraph IDs to delete")

    @field_validator("ids")
    @classmethod
    def check_ids_not_empty(cls, v):
        if not v:
            raise ValueError("The 'ids' list cannot be empty.")
        return v

class DeleteResultItem(BaseModel):
    id: str
    status: str
    message: Optional[str] = None

class DeleteResponse(BaseModel):
    status: str
    message: str
    results: List[DeleteResultItem]
