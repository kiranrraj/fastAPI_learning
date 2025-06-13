# app/schema/branch.py

from uuid import UUID
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class BranchBase(BaseModel):
    branch_code: str = Field(
        ..., 
        min_length=5, 
        max_length=5,
        description="Code for branch should be exactly five letter long",
        example=["BR001", "RM001"]
    )

    name: str = Field(
        ...,
        minlength=4,
        max_length=50,
        description="Name of the branch",
        example=["Tvpm", "Vjmd"]
    )

    address: str = Field(
        ...,
        min_length=5,
        max_length=100,
        description="Address of the branch",
        example=["Flat 1, Vjmd", "Building 732, Tvpm"]
    )

    location: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Location of the branch",
        example=["Venjaramoodu", "Trivandrum"]
    )

    phone: str = Field(
        ...,
        # pattern=r"^(?:\+91|91)?[6-9]\d{9}$",
        # description="10-digit Indian mobile number, with optional country code `+91` or `91`",
        # example=["+919876543210"],
    )

    model_config = ConfigDict(from_attributes=True)

class BranchCreate(BranchBase):
    pass

class BranchUpdate(BranchBase):
    branch_code: Optional[str] = Field(
        None,
        min_length=5, 
        max_length=5,
        description="Code for branch should be exactly five letter long",
        example=["BR001", "RM001"]
    )

    name: Optional[str] = Field(
        None,
        minlength=4,
        max_length=50,
        description="Name of the branch",
        example=["Tvpm", "Vjmd"]
    )

    address: Optional[str] = Field(
        None,
        min_length=5,
        max_length=100,
        description="Address of the branch",
        example=["Flat 1, Vjmd", "Building 732, Tvpm"]
    )

    location: Optional[str] = Field(
        None,
        min_length=3,
        max_length=50,
        description="Location of the branch",
        example=["Venjaramoodu", "Trivandrum"]
    )

    phone: Optional[str] = Field(
        None,
        # pattern=r"^(?:\+91|91)?[6-9]\d{9}$",
        # description="10-digit Indian mobile number, with optional country code `+91` or `91`",
        # example=["+919876543210", "+919876543240"],
    )

    model_config = ConfigDict(from_attributes=True)

class BranchRead(BranchBase):
    id: UUID = Field(..., description="Unique Patient ID", examples=[UUID('123e4567-e89b-12d3-a456-426614174000')])
    created_at: datetime = Field(..., description="Creation timestamp", examples=[datetime.now()])
