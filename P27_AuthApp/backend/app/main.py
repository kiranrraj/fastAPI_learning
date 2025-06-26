from fastapi import FastAPI, APIRouter
from app.api.user import router as user_router
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    yield
    print("Shutting down...")

app = FastAPI(
    title="User FastAPI",
    description="API for the user details",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(user_router)

# curl http://localhost:8000/users/health
# curl http://localhost:8000/users/spec
# curl http://localhost:8000/users/