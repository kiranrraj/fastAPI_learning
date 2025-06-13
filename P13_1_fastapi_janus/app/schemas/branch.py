from uuid import UUID
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class BranchBase(BaseModel):
    branch_code: str = Field(
        ...,
        pattern=r"^[A-Z]{3}\d{2}$",
        description="3-letter uppercase city code + 2 digits (e.g. TRV01)",
        examples=["TRV01", "MUM10"]
    )

    name: str = Field(
        ...,
        min_length=4,
        max_length=50,
        description="Official branch name",
        examples=["Trivandrum Medical Center", "Mumbai Health Clinic"]
    )

    address: str = Field(
        ...,
        min_length=5,
        max_length=100,
        description="Street address of the branch",
        examples=["Flat 12, MG Road", "Suite 5, Linking Road"]
    )

    location: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="City or locality name",
        examples=["Trivandrum", "Mumbai"]
    )

    phone: str = Field(
        ...,
        pattern=r"^(?:\+91|91)?[6-9]\d{9}$",
        description="10-digit Indian mobile number (optional +91/91 prefix)",
        examples=["+919812345678", "9812345678"]
    )

    model_config = ConfigDict(from_attributes=True)


class BranchCreate(BranchBase):
    """
    All BranchBase fields are required when creating a branch.
    """
    pass


class BranchUpdate(BaseModel):
    """
    Any subset of BranchBase fields may be updated.
    """
    branch_code: Optional[str] = Field(
        None,
        pattern=r"^[A-Z]{3}\d{2}$",
        description="Updated branch code (optional)",
        examples=["TRV02"]
    )
    name: Optional[str] = Field(
        None,
        min_length=4,
        max_length=50,
        description="Updated name (optional)",
        examples=["Trivandrum West Clinic"]
    )
    address: Optional[str] = Field(
        None,
        min_length=5,
        max_length=100,
        description="Updated address (optional)",
        examples=["Plot 45, Race Course Road"]
    )
    location: Optional[str] = Field(
        None,
        min_length=3,
        max_length=50,
        description="Updated city/locality (optional)",
        examples=["Thiruvananthapuram"]
    )
    phone: Optional[str] = Field(
        None,
        pattern=r"^(?:\+91|91)?[6-9]\d{9}$",
        description="Updated mobile (optional)",
        examples=["919876543210"]
    )

    model_config = ConfigDict(from_attributes=True)


class BranchRead(BranchBase):
    """
    Read schema includes base fields plus:
     - UUID `id`
     - `created_at` / `updated_at` timestamps
    """
    id: UUID = Field(
        ...,
        description="Unique branch UUID",
        example=UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6")
    )
    created_at: datetime = Field(
        ...,
        description="Record creation timestamp",
        example=datetime.utcnow()
    )
    updated_at: datetime = Field(
        ...,
        description="Last-modified timestamp",
        example=datetime.utcnow()
    )

    model_config = ConfigDict(from_attributes=True)
