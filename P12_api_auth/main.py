from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import uvicorn

app = FastAPI()
security = HTTPBasic()

async def get_current_user(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username == "admin" and credentials.password == "admin":
        return {"Username" : credentials.username}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Basic"}
    )

@app.get("/users/me")
async def read_current_user(user: dict = Depends(get_current_user)):
    return user

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)