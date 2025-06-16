from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from app.gremlin_client import ping_gremlin

router = APIRouter(prefix="/labx")

@router.get("/health", summary="Check Gremlin connection")
async def health_check():
    gremlin_ok = await ping_gremlin()
    
    if gremlin_ok:
        return {"status": "ok", "gremlin": "connected"}
    
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"status": "error", "gremlin": "unreachable"}
    )
