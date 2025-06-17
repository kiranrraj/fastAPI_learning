from fastapi import FastAPI, Request, Query, Body
from fastapi.responses import JSONResponse
from typing import Type
from app.core.labx_restlet import LabXRestlet
from app.core.labx_context import LabXContext

def labx_rest_register_service(app: FastAPI, path_prefix: str, context: LabXContext):
    service_instance = LabXRestlet(context)

    @app.get(f"{path_prefix}/peek")
    async def peek():
        return JSONResponse(content={"status": "LabX service is up"})

    @app.get(path_prefix)
    async def handle_get(request: Request):
        entity = request.query_params.get("entity")
        mode = request.query_params.get("mode", "list")
        return JSONResponse(content={"entity": entity, "mode": mode})

    @app.post(path_prefix)
    async def handle_post(request: Request, body: dict = Body(...)):
        entity = request.query_params.get("entity")
        mode = request.query_params.get("mode", "store")

        if not entity:
            return JSONResponse(status_code=400, content={"error": "Missing entity parameter"})

        if mode == "store":
            success = await service_instance.addupdatelist(entity, body.get("params", []))
            return {"success": success}

        elif mode == "delete":
            success = await service_instance.delete(entity, body.get("params", []))
            return {"success": success}

        elif mode == "list":
            results = await service_instance.list(entity, body.get("params", []))
            return {"results": results}

        else:
            return JSONResponse(status_code=400, content={"error": f"Unsupported mode: {mode}"})

    @app.post(f"{path_prefix}/submit")
    async def submit_async(request: Request, body: dict = Body(...)):
        return JSONResponse(content={"status": "Not implemented"})

    @app.get(f"{path_prefix}/status")
    async def check_status(job_id: str = Query(...)):
        return JSONResponse(content={"status": "Not implemented"})

    @app.get(f"{path_prefix}/result")
    async def get_result(job_id: str = Query(...)):
        return JSONResponse(content={"result": "Not implemented"})
