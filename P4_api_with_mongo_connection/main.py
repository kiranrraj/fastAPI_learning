import uvicorn
from mongo import db
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def handle_root():
    return {"message" : "Hello"}

@app.get("/users")
async def get_users():
    userNamePswd = []
    async for user in db.users.find():
        # MongoDB stores the _id field as a special ObjectId type. 
        # This line converts the ObjectId to a string so it can be easily serialized into JSON.
        user["_id"] = str(user["_id"])
        userNamePswd.append({"username": user["username"], "password": user["password"]})
    return userNamePswd

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)