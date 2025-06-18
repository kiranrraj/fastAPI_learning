from pydantic import BaseModel, field_validator
from typing import Any


class LabXBaseModel(BaseModel):
    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
        "extra": "ignore"
    }

    @field_validator("phone", check_fields=False)
    @classmethod
    def validate_phone(cls, v: Any) -> str:
        if not isinstance(v, str) or not v.isdigit() or not v.startswith(("6", "7", "8", "9")) or len(v) != 10:
            raise ValueError("Phone must be a valid Indian 10-digit mobile number")
        return v

    @field_validator("*", mode="before", check_fields=False)
    @classmethod
    def validate_string_lengths(cls, v: Any, info) -> Any:
        if isinstance(v, str) and info.field_name != "phone":
            length = len(v.strip())
            if info.field_name == "address":
                if not (2 <= length <= 100):
                    raise ValueError("Address must be between 2 and 100 characters")
            else:
                if not (2 <= length <= 50):
                    raise ValueError(f"{info.field_name} must be between 2 and 50 characters")
        return v
