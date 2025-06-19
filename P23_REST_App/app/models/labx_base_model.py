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
        if isinstance(v, str):
            field = info.field_name

            # Treat empty string as None for optional fields
            if v.strip() == "":
                return None

            length = len(v.strip())

            if field == "phone":
                return v  # phone is validated separately
            elif not (1 <= length <= 100):
                raise ValueError(f"{field} must be between 1 and 100 characters")

        return v
