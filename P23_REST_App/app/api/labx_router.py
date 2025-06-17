# labx_app/api/labx_router.py

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from app.core.labx_restlet import LabXRestlet
from app.core.labx_context import LabXContext
from app.models.labx_spec_model import LabXEntitySpec
from app.dependency.labx_dependencies import get_context

router = APIRouter()

# ----------- Pydantic Models -----------
class EntityParams(BaseModel):
    params: List[Dict[str, Any]]

class SingleSpec(BaseModel):
    data: Dict[str, Any]

class AttributeList(BaseModel):
    attributes: List[Dict[str, Any]]


# ----------- Helper to Get Restlet -----------
def get_restlet(request: Request) -> LabXRestlet:
    context: LabXContext = request.app.state.context
    return LabXRestlet(context)


# ----------- Entity Operations -----------
@router.post("/entity/{entity_name}/upsert")
async def upsert_entity( entity_name: str, body: Dict[str, Any], request: Request):
    restlet = get_restlet(request)
    params = body.get("params", [])
    result = await restlet.addupdatelist(entity_name, params, return_ids=True)
    return result

@router.post("/entity/{entity}/delete")
async def delete_entity(entity: str, request: Request):
    restlet = get_restlet(request)
    data = await request.json()
    ids = data.get("ids", [])
    result = await restlet.deletelist(entity_name=entity, ids=ids)
    return result

@router.post("/entity/{entity_name}/list")
async def list_entity(entity_name: str, body: EntityParams, request: Request):
    restlet = get_restlet(request)
    result = await restlet.list(entity_name, body.params)
    return {"results": result}


@router.get("/entity/{entity_name}/spec", response_model=LabXEntitySpec)
async def get_entity_spec(request: Request, entity_name: str, mode: str = "CRUD"):
    restlet = get_restlet(request)
    return await restlet.get_spec(entity_name, mode)


# ----------- Metadata Management -----------

@router.post("/spec/entity/add")
async def add_entity_spec(body: SingleSpec, request: Request):
    restlet = get_restlet(request)
    result = await restlet.add_entity_spec(body.data)
    if not result:
        raise HTTPException(status_code=500, detail="Entity spec add failed")
    return {"status": "success"}

@router.post("/spec/entity/{entity_name}/attrs/add")
async def add_entity_attributes(entity_name: str, body: AttributeList, request: Request):
    restlet = get_restlet(request)
    result = await restlet.add_entity_attrs(entity_name, body.attributes)
    if not result:
        raise HTTPException(status_code=500, detail="Entity attributes add failed")
    return {"status": "success"}

@router.post("/spec/edge/add")
async def add_edge_spec(body: SingleSpec, request: Request):
    restlet = get_restlet(request)
    result = await restlet.add_edge_spec(body.data)
    if not result:
        raise HTTPException(status_code=500, detail="Edge spec add failed")
    return {"status": "success"}

@router.post("/spec/edge/{edge_name}/attrs/add")
async def add_edge_attributes(edge_name: str, body: AttributeList, request: Request):
    restlet = get_restlet(request)
    result = await restlet.add_edge_attrs(edge_name, body.attributes)
    if not result:
        raise HTTPException(status_code=500, detail="Edge attributes add failed")
    return {"status": "success"}
