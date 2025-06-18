from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from app.core.labx_restlet import LabXRestlet
from app.core.labx_context import LabXContext
from app.models.labx_spec_model import LabXEntitySpec

router = APIRouter()

# ----------- Pydantic Models -----------

class EntityParams(BaseModel):
    params: List[Dict[str, Any]]

class SingleSpec(BaseModel):
    data: Dict[str, Any]

class AttributeList(BaseModel):
    attributes: List[Dict[str, Any]]

# ----------- Helper -----------

def get_restlet(request: Request) -> LabXRestlet:
    context: LabXContext = request.app.state.context
    return LabXRestlet(context)

# ----------- Health Check -----------

@router.get("/health", tags=["System"])
async def health_check():
    return {"status": "ok", "message": "LabX API is running"}

# ----------- Entity Operations -----------

@router.post("/entity/{entity_name}/upsert", tags=["Entity Operations"])
async def upsert_entity(entity_name: str, body: EntityParams, request: Request):
    restlet = get_restlet(request)
    result = await restlet.addupdatelist(entity_name, body.params)
    return {
        "status": result.get("status", "unknown"),
        "message": result.get("message", ""),
        "data": result.get("results", [])
    }

@router.post("/entity/{entity}/delete", tags=["Entity Operations"])
async def delete_entity(entity: str, request: Request):
    restlet = get_restlet(request)
    data = await request.json()
    ids = data.get("ids", [])
    result = await restlet.deletelist(entity_name=entity, ids=ids)
    return {
        "status": result.get("status", "unknown"),
        "message": result.get("message", ""),
        "data": result.get("results", [])
    }

@router.post("/entity/{entity_name}/list", tags=["Entity Operations"])
async def list_entity(entity_name: str, body: EntityParams, request: Request):
    restlet = get_restlet(request)
    result = await restlet.list(entity_name, body.params)
    return result 

@router.get("/labx/entity/{entity_name}/spec", response_model=LabXEntitySpec, tags=["Entity Operations"])
async def get_entity_spec(request: Request, entity_name: str, mode: str = "CRUD"):
    # restlet = get_restlet(request)
    # return await restlet.get_spec(entity_name, mode)
    try:
        restlet = get_restlet(request)
        return await restlet.get_spec(entity_name, mode)
    except SpecValidationError as e:
        raise HTTPException(status_code=404, detail=str(e))

# ----------- Metadata Management -----------

@router.post("/spec/entity/add", tags=["Spec Management"])
async def add_entity_spec(body: SingleSpec, request: Request):
    restlet = get_restlet(request)
    result = await restlet.add_entity_spec(body.data)
    if not result:
        raise HTTPException(status_code=500, detail="Entity spec add failed")
    return {"status": "success", "message": "Entity spec added"}

@router.post("/spec/entity/{entity_name}/attrs/add", tags=["Spec Management"])
async def add_entity_attributes(entity_name: str, body: AttributeList, request: Request):
    restlet = get_restlet(request)
    result = await restlet.add_entity_attrs(entity_name, body.attributes)
    if not result:
        raise HTTPException(status_code=500, detail="Entity attributes add failed")
    return {"status": "success", "message": "Attributes added"}

@router.post("/spec/edge/add", tags=["Spec Management"])
async def add_edge_spec(body: SingleSpec, request: Request):
    restlet = get_restlet(request)
    result = await restlet.add_edge_spec(body.data)
    if not result:
        raise HTTPException(status_code=500, detail="Edge spec add failed")
    return {"status": "success", "message": "Edge spec added"}

@router.post("/spec/edge/{edge_name}/attrs/add", tags=["Spec Management"])
async def add_edge_attributes(edge_name: str, body: AttributeList, request: Request):
    restlet = get_restlet(request)
    result = await restlet.add_edge_attrs(edge_name, body.attributes)
    if not result:
        raise HTTPException(status_code=500, detail="Edge attributes add failed")
    return {"status": "success", "message": "Edge attributes added"}
