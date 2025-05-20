import uvicorn
from typing import Dict
from UserModel import UserModel, users
from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/users/all")
async def get_all_users():
    return list(users.values())


@app.get("/users/{user_id}")
async def read_user(user_id: int):
    if user_id not in users:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return users[user_id]

@app.post("/users/")
async def create_user(user: UserModel):
    # Determine the next available user ID
    if users:
        next_id = max(users.keys()) + 1
    else:
        next_id = 1

    # Create user data dictionary
    user_data = user.model_dump()
    user_data["id"] = next_id

    # Store user
    users[next_id] = user_data
    return {"id": next_id, **user.model_dump()}

@app.put("/users/{user_id}")
async def update_user(user_id: int, user: UserModel):
    if user_id not in users:
        raise HTTPException(
            status_code=404,
            detail="User id not found"
        )
    user_data = user.model_dump()
    user_data["id"] = user_id 
    users[user_id] = user_data
    return {"id": user_id, **user.model_dump()}

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    del users[user_id]
    return {"message": f"User {user_id} deleted"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)