from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, field_validator
from typing import List
import uvicorn

app = FastAPI()
items = []

class Item(BaseModel):
    name: str
    price: float
    tags: List[str]

    @field_validator('price')
    def price_positive(cls, price):
        if price <= 0:
            raise ValueError("Price must be positive")
        return price
    
    @field_validator('tags')
    def tags_not_empty(cls, tags):
        if not tags:
            raise ValueError("At least one tag is required")
        return tags
    
@app.post("/items/")
async def create_item(item: Item):
    items.append({"name": item.name, "price": item.price, "tags": item.tags})
    return item
# http://127.0.0.1:8000/items/
# Header
#   Content-Type: application/json
#
# Body
# {
#     "name" : "Toor Dal",
#     "price" : 190.5,
#     "tags" : ["dal"]
# }


@app.get("/items/")
async def get_items_by_tag(tag: str = Query(..., min_length=3)):
    matched_item = [item for item in items if tag in item["tags"]]
    # print(matched_item)
    if not matched_item:
            raise HTTPException(status_code=404, detail=f"No items found with tag '{tag}'")
    return matched_item
# http://127.0.0.1:8000/items/?tag=dal
# [{"name":"Moong Dal","price":90.5,"tags":["dal"]}]

if __name__ == "__main__":
     print(items)
     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
     