# app/routes/labrest_router.py

from fastapi import APIRouter, Depends, Request, Body, HTTPException
from typing import Dict, Any

from app.services.generic_services import GenericLabRestService

router = APIRouter(tags=["LabRest"])

def get_generic_service():
    # This runs per request, after startup has initialized Gremlin
    return GenericLabRestService()

@router.get("/lab/peek")
async def peek(service: GenericLabRestService = Depends(get_generic_service)):
    return await service.peek()

@router.get("/lab")
async def handle_get(request: Request, service: GenericLabRestService = Depends(get_generic_service)):
    qp: Dict[str, Any] = dict(request.query_params)
    return await service.handle_request(qp)

@router.post("/lab")
async def handle_post(
    request: Request,
    body: Dict[str, Any] = Body(...),
    service: GenericLabRestService = Depends(get_generic_service),
):
    qp: Dict[str, Any] = dict(request.query_params)
    return await service.handle_request(qp, body)
