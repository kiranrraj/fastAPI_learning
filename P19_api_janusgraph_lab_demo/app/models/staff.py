# app/models/staff.py
from pydantic import BaseModel, Field, field_validator, model_serializer
from uuid import UUID, uuid4
from enum import Enum
from datetime import datetime
from app.utils.time import IST, format_datetime_to_ist

class StaffRoleEnum(str, Enum):
    doctor = "doctor"
    nurse = "nurse"
    technician = "technician"
    admin = "admin"
    other = "other"

class StaffCreate(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    role: StaffRoleEnum = Field(default=StaffRoleEnum.other)
    branch_id: UUID = Field(...)  # mandatory branch assignment

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_names(cls, value: str) -> str:
        value = value.strip()
        if not value.isalpha():
            raise ValueError("Name must contain only alphabetic characters")
        return value.title()

class Staff(StaffCreate):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=lambda: datetime.now(IST))
    emp_id: str = Field(default="")  # assigned externally

    @model_serializer
    def serialize_created_at(self) -> str:
        return format_datetime_to_ist(self.created_at)
