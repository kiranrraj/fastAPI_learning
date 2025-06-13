from datetime import datetime
from pydantic import BaseModel, ConfigDict

class TimestampMixin(BaseModel):
    """
    Mixin to add a created_at or recorded_at timestamp.
    Enables ORM-mode so that models returned
    from the Gremlin client can be parsed from attributes.
    """
    created_at: datetime  # common timestamp field

    # Pydantic v2: enable ORM-style parsing from attributes
    model_config = ConfigDict(from_attributes=True)
