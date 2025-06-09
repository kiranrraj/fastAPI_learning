# app/api/routes.py

from fastapi import FastAPI

# Import routers from each module
from app.api.v1.endpoints import (
    entity,
    spec,
    edge,
    auth,
    health,
    report,
    admin,
    logs
)

def register_routers(app: FastAPI):
    # Core functional endpoints
    app.include_router(entity.router, prefix="/api/v1", tags=["Entity"])
    app.include_router(spec.router, prefix="/api/v1", tags=["Spec"])
    app.include_router(edge.router, prefix="/api/v1", tags=["Edge"])
    
    # System-related endpoints
    app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
    app.include_router(health.router, prefix="/api/v1", tags=["Health"])
    
    # Optional modules
    app.include_router(report.router, prefix="/api/v1", tags=["Report"])
    app.include_router(admin.router, prefix="/api/v1", tags=["Admin"])
    app.include_router(logs.router, prefix="/api/v1", tags=["Logs"])
