from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def handle_root():
    return {"message": "Hello World"}

@app.get("/user/{userID}")
def handle_user(userID):
    return {"UserID" : userID}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)