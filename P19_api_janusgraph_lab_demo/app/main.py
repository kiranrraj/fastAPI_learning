from fastapi import FastAPI
from app.core.logger import setup_logging
from app.api.v1.endpoints import health
from app.api.v1.endpoints import patients
from app.api.v1.endpoints import results
from app.api.v1.endpoints import branch
from app.api.v1.endpoints import investigation
from app.api.v1.endpoints import staff

setup_logging()

app = FastAPI(
    title="Lap App API",
    version="1.0.0",
    description="Backend for medical lab dashboard"
)

# include_router() is a FastAPI method used to add routes (endpoints) 
# defined in a separate router to the main application.
app.include_router(health.router, prefix="/status")

# app/api/v1/endpoints/health.py is the module where you defined your health endpoints, 
# in that we created an instance of APIRouter() called router. So health.router 
# is the router instance that contains the health check endpoints

app.include_router(patients.router, prefix="")
app.include_router(results.router, prefix="")
app.include_router(investigation.router, prefix="")
app.include_router(staff.router, prefix="")
app.include_router(branch.router, prefix="")
