from pydantic import BaseModel, Field, field_validator
from uuid import UUID, uuid4
from typing import Optional

class BranchCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Branch name")
    address: Optional[str] = Field(None, max_length=200, description="Branch address")
    phone: Optional[str] = Field(None, description="Contact phone number")

    @field_validator("name", "address", "phone")
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
