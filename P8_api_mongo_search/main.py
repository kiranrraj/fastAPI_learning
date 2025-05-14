from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn

app = FastAPI()
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["health_dashboard"]

@app.get("/search/{username}")
async def search_db(username):
    results = []
    async for user in db.users.find({"username": username}):
        user["_id"] = str(user["_id"])  
        results.append(user)
    if (len(results) > 0):
        return results
    else:
        return {"Message": "User not found"}

@app.get("/search_one/{username}")
async def search_db(username: str):
    user = await db.users.find_one({"username": username})
    if user:
        user["_id"] = str(user["_id"])
        return user
    return {"message": "User not found"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)