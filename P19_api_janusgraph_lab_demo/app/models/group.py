from pydantic import BaseModel, Field, field_validator, model_serializer
from uuid import UUID, uuid4
from typing import Optional
from datetime import datetime
from app.utils.time import IST, format_datetime_to_ist

class InvestigationGroupCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Name of the investigation group")
    description: Optional[str] = Field(None, max_length=300, description="Optional description of the group")

    parent_group_id: Optional[UUID] = Field(None, description="UUID of the parent group, if any")
    created_by: Optional[UUID] = Field(None, description="UUID of the staff who created this group")

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Mandatory Field")
        return value.title()

class InvestigationGroup(InvestigationGroupCreate):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=lambda: datetime.now(IST))
    group_code: str = Field(default="")  # to be generated in service logic

    @model_serializer
    def serialize_created_at(self) -> str:
        return format_datetime_to_ist(self.created_at)
