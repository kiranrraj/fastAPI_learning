# gbeex-backend/models/common.py
from typing import Generic, List, TypeVar
from pydantic import BaseModel, Field

# Define a generic type variable that can be any BaseModel
T = TypeVar('T', bound=BaseModel)

class PaginatedResponse(BaseModel, Generic[T]):
    """
    A generic Pydantic model for paginated API responses.
    """
    total_count: int = Field(..., description="Total number of items matching the query across all pages.")
    page: int = Field(..., description="The current page number (1-indexed).")
    limit: int = Field(..., description="The maximum number of items per page.")
    items: List[T] = Field(..., description="A list of items for the current page.")