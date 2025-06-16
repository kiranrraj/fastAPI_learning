from fastapi import APIRouter, Request, Body, Query
from fastapi.responses import JSONResponse
from typing import Type
from app.core.labrest_services_base import LabRestServiceBase

def register_labrest_service(router: APIRouter, path_prefix: str, service_cls: Type[LabRestServiceBase]):
    service = service_cls()

    @router.get(f"{path_prefix}/peek")
    async def peek():
        return JSONResponse(content=service.peek())

    @router.get(path_prefix)
    async def handle_get(request: Request):
        query_params = dict(request.query_params)
        return JSONResponse(content=service.handle_request(query_params))

    @router.post(path_prefix)
    async def handle_post(request: Request, body: dict = Body(...)):
        query_params = dict(request.query_params)
        return JSONResponse(content=service.handle_request(query_params, body))

    @router.post(f"{path_prefix}/submit")
    async def submit_async(request: Request, body: dict = Body(...)):
        query_params = dict(request.query_params)
        return JSONResponse(content=service.submit_async(query_params, body))

    @router.get(f"{path_prefix}/status")
    async def check_status(job_id: str = Query(...)):
        return JSONResponse(content=service.check_status(job_id))

    @router.get(f"{path_prefix}/result")
    async def get_result(job_id: str = Query(...)):
        return JSONResponse(content=service.get_async_result(job_id))