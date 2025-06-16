from fastapi import FastAPI, Request, Query, Body
from fastapi.responses import JSONResponse
from typing import Type
from app.labrest_base import LabRestServiceBase  # Make sure this is correctly imported

def register_service(app: FastAPI, path_prefix: str, service_cls: Type[LabRestServiceBase]):
    """
    Registers a LabRest-compatible service with standard REST endpoints.

    :param app: FastAPI app instance
    :param path_prefix: URL prefix (e.g., '/labx/report')
    :param service_cls: A class inheriting from LabRestServiceBase
    """

    service_instance = service_cls()  # Instantiate the service

    @app.get(f"{path_prefix}/peek", tags=["LabRest"])
    async def peek():
        """
        GET /{prefix}/peek
        Returns service metadata (name, description, etc.).
        Useful for diagnostics or UI builders.
        """
        return JSONResponse(content=service_instance.peek())

    @app.get(path_prefix, tags=["LabRest"])
    async def handle_get(request: Request):
        """
        GET /{prefix}
        Synchronous GET with query parameters.
        Example: /labx/summary?first_name=Ananya&age=32
        """
        query_params = dict(request.query_params)
        return JSONResponse(content=service_instance.handle_request(query_params))

    @app.post(path_prefix, tags=["LabRest"])
    async def handle_post(request: Request, body: dict = Body(...)):
        """
        POST /{prefix}
        Synchronous POST with optional query params and JSON body.
        Example: POST /labx/summary with JSON: { "name": "Amit" }
        """
        query_params = dict(request.query_params)
        return JSONResponse(content=service_instance.handle_request(query_params, body))

    @app.post(f"{path_prefix}/submit", tags=["LabRest"])
    async def submit_async(request: Request, body: dict = Body(...)):
        """
        POST /{prefix}/submit
        Submit long-running task asynchronously.
        Returns: { "job_id": "<uuid>" }
        """
        query_params = dict(request.query_params)
        return JSONResponse(content=service_instance.submit_async(query_params, body))

    @app.get(f"{path_prefix}/status", tags=["LabRest"])
    async def check_status(job_id: str = Query(...)):
        """
        GET /{prefix}/status?job_id=...
        Returns current status of a submitted job.
        Returns: { "status": "processing" | "completed" | "failed" | "not_found" }
        """
        return JSONResponse(content=service_instance.check_status(job_id))

    @app.get(f"{path_prefix}/result", tags=["LabRest"])
    async def get_result(job_id: str = Query(...)):
        """
        GET /{prefix}/result?job_id=...
        Returns the result of a completed async job.
        If not yet complete: result will be null.
        """
        return JSONResponse(content=service_instance.get_async_result(job_id))
