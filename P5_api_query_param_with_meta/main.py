from typing import List
from fastapi import FastAPI, Query
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["health_dashboard"]

app = FastAPI()
@app.get("/")
def get_products( q: str = Query(..., min_length=3, max_length=50, title="Search query", alias="search")):
    return {"q": q}
# http://127.0.0.1:8010/?search=kiran
# {"q":"kiran"}

# Explanation
    # q: str: This parameter will be received as a query parameter in the URL.
    # Query(...): ... as the default value signifies that this parameter is required, if not provided, FastAPI will return an error.
    # min_length=3: This validation rule ensures that the value of the q parameter must have a minimum length of 3 characters.
    # max_length=50: This validation rule ensures that the value of the q parameter cannot exceed 50 characters.
    # title="Search query": This provides a title for the query parameter, which can be useful for automatic API documentation.
    # alias="search": alias name to the query parameter q, which can be used in the URL,(/?search=kiran), 
    #   while the parameter is still named q in Python function.

@app.get("/tags/")
def filter_items(tags: List[str] = Query([])):
    return {"tags": tags}
# http://127.0.0.1:8010/tags/?tags=hello&tags=world
# {"tags":["hello","world"]}

# Explanation
    # tags: List[str]: declares a parameter named tags that is expected to be a list of strings (List[str]). 
    # Query([]): Here, Query([]) indicates that tags is a query parameter, and its default value is an empty list ([]). 
    #   FastAPI automatically handles multiple values for the same query parameter name, collecting them into a list.

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)
