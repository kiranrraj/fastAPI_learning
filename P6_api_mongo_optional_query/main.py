import uvicorn
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI

app = FastAPI()
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["health_dashboard"]

@app.get("/")
def handle_root():
    return {"message" : "Hello"}

@app.get("/users")
async def get_users(skip: int = 0, limit: int = 5):
    users = []
    async for user in db.users.find():
        user["_id"] = str(user["_id"])
        users.append(user)
    return users[skip: skip+limit]

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)


# Default (No Parameters): http://127.0.0.1:8010/users
    # Endpoint: /users
    # This will use the default values for skip (0) and limit (5).  It will return the first 5 users.

# Only skip: http://127.0.0.1:8010/users?skip=10
    # Endpoint: /users?skip=10
    # This will skip the first 10 users and return the next 5 (due to the default limit of 5).
    
# Only limit: http://127.0.0.1:8010/users?limit=10
    # Endpoint: /users?limit=10
    # This will skip the first 0 users (default skip value) and return the first 10 users.

# Both skip and limit: http://127.0.0.1:8010/users?skip=10&limit=3