#D: app\routers\health.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.deps.gremlin_client import get_gremlin_client, gremlin_query_async
from gremlin_python.driver.client import Client

router = APIRouter(tags=["Health"])

class HealthOut(BaseModel):
    status: str

async def gremlin_health_check(client: Client) -> bool:
    try:
        await client.submit("g.V().limit(1)").all()
        return True
    except:
        return False

@router.get("/health", response_model=HealthOut)
async def health(client: Client = Depends(get_gremlin_client)):
    try:
        # run in threadpool so we don't block the loop
        results = await gremlin_query_async(client, "g.V().limit(1)")
        return {"status": "ok", "sample_count": len(results)}
    except Exception:
        raise HTTPException(status_code=503, detail="Cannot reach JanusGraph")
