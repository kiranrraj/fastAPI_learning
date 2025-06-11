from fastapi import FastAPI
import uvicorn

app = FastAPI(
    title="My Awesome API",
    description="A comprehensive API for managing users and data.",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json", # Custom path for OpenAPI schema
    docs_url="/documentation",          # Custom path for Swagger UI
    redoc_url="/redoc-documentation",   # Custom path for ReDoc
    debug=True,                         # Typically True in dev, False in prod
)

@app.get("/")
def handle_root():
    return {"message": "Hello World"}

@app.get("/user/{userID}")
def handle_user(userID):
    return {"UserID" : userID}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)