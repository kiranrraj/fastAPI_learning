from fastapi import FastAPI
from enum import Enum
import uvicorn

app = FastAPI()

class UserNames(str, Enum):
    user1 = "admin"
    user2 = "doctor"
    user3 = "testCenter"

@app.get("/user/{name}")
def handle_root(name):
    if UserNames.user1.name == name:
        return {"userDetail": UserNames.user1.value}
    elif UserNames.user2.name == name:
        return {"userDetails": UserNames.user2.value}
    elif UserNames.user3.name == name:
        return {"userDetails": UserNames.user3.value}
    else:
        return {"userDetails": "Not found"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)