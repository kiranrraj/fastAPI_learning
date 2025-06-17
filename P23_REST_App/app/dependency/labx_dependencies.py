# app/dependency/labx_dependencies.py

from fastapi import Request
from app.core.labx_context import LabXContext

def get_context(request: Request) -> LabXContext:
    return request.app.state.context
