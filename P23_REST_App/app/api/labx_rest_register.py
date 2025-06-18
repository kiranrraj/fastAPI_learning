from fastapi import FastAPI, Request, Query, Body
from fastapi.responses import JSONResponse
from typing import Type
from app.core.labx_restlet import LabXRestlet
from app.core.labx_context import LabXContext

def labx_rest_register_service(app: FastAPI, path_prefix: str, context: LabXContext):
    service_instance = LabXRestlet(context)

    @app.get(f"{path_prefix}/peek")
    async def peek():
        return JSONResponse(content={
            "status": "success",
            "message": "LabX REST service is up"
        })

    @app.get(path_prefix)
    async def handle_get(request: Request):
        entity = request.query_params.get("entity")
        mode = request.query_params.get("mode", "list")
        return JSONResponse(content={
            "status": "success",
            "message": f"GET handler ready for entity '{entity}' in mode '{mode}'",
            "data": {}
        })

    @app.post(path_prefix)
    async def handle_post(request: Request, body: dict = Body(...)):
        entity = request.query_params.get("entity")
        mode = request.query_params.get("mode", "store")

        if not entity:
            return JSONResponse(status_code=400, content={
                "status": "error",
                "message": "Missing 'entity' query parameter",
                "data": []
            })

        params = body.get("params", [])

        if mode == "store":
            result = await service_instance.addupdatelist(entity, params)
            return JSONResponse(content={
                "status": result.get("status", "unknown"),
                "message": result.get("message", ""),
                "data": result.get("results", [])
            })

        elif mode == "delete":
            ids = [item.get("id") for item in params if "id" in item]
            result = await service_instance.deletelist(entity, ids)
            return JSONResponse(content={
                "status": result.get("status", "unknown"),
                "message": result.get("message", ""),
                "data": result.get("results", [])
            })

        elif mode == "list":
            result = await service_instance.list(entity, params)
            return JSONResponse(content={
                "status": "success",
                "message": f"Listed records for entity '{entity}'",
                "data": result
            })

        else:
            return JSONResponse(status_code=400, content={
                "status": "error",
                "message": f"Unsupported mode: {mode}",
                "data": []
            })

    @app.post(f"{path_prefix}/submit")
    async def submit_async(request: Request, body: dict = Body(...)):
        return JSONResponse(content={
            "status": "not_implemented",
            "message": "Async job submission not implemented yet",
            "data": {}
        })

    @app.get(f"{path_prefix}/status")
    async def check_status(job_id: str = Query(...)):
        return JSONResponse(content={
            "status": "not_implemented",
            "message": f"Status for job '{job_id}' is not available",
            "data": {}
        })

    @app.get(f"{path_prefix}/result")
    async def get_result(job_id: str = Query(...)):
        return JSONResponse(content={
            "status": "not_implemented",
            "message": f"Result for job '{job_id}' is not available",
            "data": {}
        })
