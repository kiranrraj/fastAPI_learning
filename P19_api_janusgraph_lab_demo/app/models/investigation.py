from pydantic import BaseModel, Field, field_validator, model_serializer
from uuid import UUID, uuid4
from typing import Optional
from datetime import datetime
from app.utils.time import IST, format_datetime_to_ist
from app.utils.investigation_id import generate_investigation_id

class InvestigationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Name of investigation")
    unit: str = Field(..., min_length=1, max_length=20, description="Unit of measurement")
    reference_range: Optional[str] = Field(None, max_length=100, description="Reference range for the investigation")
    group_id: Optional[UUID] = Field(None, description="UUID of the group this investigation is part of")
    ordered_by: Optional[UUID] = Field(None, description="UUID of the staff who ordered the investigation")

    @field_validator("name", "unit")
    @classmethod
    def validate_strings(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Mandatory field")
        return value.title()

class Investigation(InvestigationCreate):
    id: UUID = Field(default_factory=uuid4)
    investigation_id: str = Field(default="")
    created_at: datetime = Field(default_factory=lambda: datetime.now(IST))

    @field_validator("investigation_id", mode="before")
    @classmethod
    def set_investigation_id(cls, v, info):
        if v:
            return v
        name = info.data.get("name", "test")
        created_at = info.data.get("created_at") or datetime.now(IST)
        return generate_investigation_id(name, created_at)

    @model_serializer
    def serialize_created_at(self) -> str:
        return format_datetime_to_ist(self.created_at)
