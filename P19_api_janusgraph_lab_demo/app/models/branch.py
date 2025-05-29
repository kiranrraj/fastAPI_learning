# app/models/branch.py
from pydantic import BaseModel, Field, field_validator, model_serializer
from uuid import UUID, uuid4
from typing import Optional
from datetime import datetime
from app.utils.time import IST, format_datetime_to_ist
from app.utils.branch_code import BranchCodeGenerator

class BranchCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Branch name")
    location: str = Field(..., min_length=2, max_length=100, description="Branch location (city or area)")
    address: Optional[str] = Field(None, max_length=200, description="Branch address")
    phone: Optional[str] = Field(None, description="Contact phone number")

    @field_validator("name", "address", "phone", "location")
    @classmethod
    def strip_strings(cls, value: Optional[str]) -> Optional[str]:
        if value:
            return value.strip()
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, phone: Optional[str]) -> Optional[str]:
        if phone and not phone.startswith("+91"):
            raise ValueError("Phone number must start with +91")
        return phone

class Branch(BranchCreate):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=lambda: datetime.now(IST))
    branch_code: str = Field(default="")

    @field_validator("branch_code", mode="before")
    @classmethod
    def set_branch_code(cls, v, info):
        if v:
            return v
        location = info.data.get("location")
        if not location:
            raise ValueError("Location is required to generate branch_code")
        return BranchCodeGenerator.generate_branch_code(location)

    @model_serializer
    def serialize_created_at(self) -> str:
        return format_datetime_to_ist(self.created_at)
