from typing import List, Optional, Literal, Dict, Any
from fastapi import FastAPI, Query, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn

app = FastAPI(
    title="Advanced Query Parameters Demo App",
    description="Demonstrating various query parameter options in FastAPI for a better understanding.",
    version="1.0.1"
)

# Root endpoint
# Example: GET /?search=keyword
@app.get("/")
async def get_products(q: str = Query(..., min_length=3, max_length=50, title="Search query", alias="search")):
    return {"q": q}

# Endpoint 2: Multiple Tags as a List 
# Example: GET /tags/?tags=tag1&tags=tag2
@app.get("/tags/")
async def filter_items(tags: List[str] = Query([], description="Filter items by multiple tags.")):
    return {"tags": tags}

# Required keyword with alias and length constraints
@app.get("/orders/search", response_model=Dict[str, Any])
async def search_orders( keyword: str = Query(..., min_length=2, max_length=100, alias="q",
    description="A required keyword to search within order details."),
    # Optional status filter with predefined allowed values (Literal)
    status: Optional[Literal["pending", "completed", "cancelled", "shipped"]] = Query(
        None, # Default value is None, making it optional
        description="Filter orders by their current status."
    ),
    # Optional minimum total, with a 'greater than or equal to' constraint
    min_total: Optional[float] = Query(
        None, # Default value is None, making it optional
        ge=0, # Value must be greater than or equal to 0
        description="Filter orders with a minimum total amount."
    ),
    # Optional maximum total, with a 'less than or equal to' constraint
    max_total: Optional[float] = Query(
        None, # Default value is None, making it optional
        le=10000, # Value must be less than or equal to 10000
        description="Filter orders with a maximum total amount."
    ),
    # Optional boolean flag with a default value
    is_priority: bool = Query(
        False, # Default value is False
        description="Set to true to filter for priority orders."
    ),
    # Optional list of sort fields, with example defaults
    sort_by: List[Literal["date", "total", "customer_name"]] = Query(
        [], # Default value is an empty list
        description="Fields to sort the results by. Can specify multiple times for multi-level sorting."
    )
):
    if min_total is not None and max_total is not None and min_total > max_total:
        raise HTTPException(
            status_code=400,
            detail="min_total cannot be greater than max_total"
        )

    return {
        "search_keyword": keyword,
        "filter_status": status,
        "min_order_total": min_total,
        "max_order_total": max_total,
        "priority_orders_only": is_priority,
        "sort_order_by": sort_by
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)

## Endpoint Examples 
## -----------------
# http://127.0.0.1:8010/orders/search
# http://127.0.0.1:8010/orders/search?q=kitchenware
# http://127.0.0.1:8010/orders/search?q=electronics&status=completed
# http://127.0.0.1:8010/orders/search?q=books&min_total=25.50
# http://127.0.0.1:8010/orders/search?q=clothing&max_total=150
# http://127.0.0.1:8010/orders/search?q=urgent&is_priority=true
# http://127.0.0.1:8010/orders/search?q=analysis&sort_by=date&sort_by=customer_name
# http://127.0.0.1:8010/orders/search?q=test&status=in_progress
# http://127.0.0.1:8010/orders/search?q=price_range&min_total=200&max_total=100

# http://127.0.0.1:8010/orders/search?q=gadgets&status=shipped&min_total=50&max_total=500&is_priority=false&sort_by=total
# {
#   "search_keyword": "gadgets",
#   "filter_status": "shipped",
#   "min_order_total": 50,
#   "max_order_total": 500,
#   "priority_orders_only": false,
#   "sort_order_by": [
#     "total"
#   ]
# }