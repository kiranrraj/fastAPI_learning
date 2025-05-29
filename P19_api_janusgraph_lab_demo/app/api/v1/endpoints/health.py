from fastapi import APIRouter
import logging

router = APIRouter()
logger = logging.getLogger("lab_app")

@router.get("/health", tags=["Health"])
def health_check():
    logger.info("Health check called")
    return {
        "status": "OK",
        "message": "Lab App API is healthy"
    }


# prefix="/status" means that all routes in health.router will be "mounted" under 
# the /status path prefix, means /health endpoint will be accessible at /status/health.

# tags=["health"] This is a metadata tag for the OpenAPI (Swagger) documentation.
# When you open /docs or /redoc, you will see a section titled "health" containing 
# all endpoints with this tag.