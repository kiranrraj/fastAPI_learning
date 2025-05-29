from fastapi import FastAPI
from app.core.logger import setup_logging
from app.api.v1.endpoints import health

setup_logging()

app = FastAPI(
    title="Lap App API",
    version="1.0.0",
    description="Backend for medical lab dashboard"
)

# include_router() is a FastAPI method used to add routes (endpoints) 
# defined in a separate router to the main application.
app.include_router(health.router)

# app/api/v1/endpoints/health.py is the module where you defined your health endpoints, 
# in that we created an instance of APIRouter() called router. So health.router 
# is the router instance that contains the health check endpoints