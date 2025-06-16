# app/handlers/error_handlers.py

from app.logger import logger 
from fastapi import Request  
from fastapi.responses import JSONResponse  

# Default fallback handler
from fastapi.exception_handlers import http_exception_handler

# Exception for validation errors
from fastapi.exceptions import RequestValidationError  
from starlette.exceptions import HTTPException as StarletteHTTPException 
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND, HTTP_405_METHOD_NOT_ALLOWED, HTTP_500_INTERNAL_SERVER_ERROR

# Custom HTTP Exception Handler
# Handles all Starlette HTTP exceptions with custom responses
async def custom_http_exception_handler(
    request: Request, 
    exc: StarletteHTTPException
):
    if exc.status_code == HTTP_404_NOT_FOUND:
        return JSONResponse(
            status_code=404,
            content={
                "error": "LabX Route not found",
                "hint": "Please check the URL or visit /labx/docs to explore available endpoints."
            },
        )
    elif exc.status_code == HTTP_401_UNAUTHORIZED:
        return JSONResponse(
            status_code=401,
            content={"error": "Unauthorized", "hint": "Authentication credentials were missing or invalid."},
        )
    elif exc.status_code == HTTP_403_FORBIDDEN:
        return JSONResponse(
            status_code=403,
            content={"error": "Forbidden", "hint": "You do not have permission to access this resource."},
        )
    elif exc.status_code == HTTP_405_METHOD_NOT_ALLOWED:
        return JSONResponse(
            status_code=405,
            content={"error": "Method Not Allowed", "hint": f"The method {request.method} is not supported on this route."},
        )
    else:
        # Fallback to default handler for all other HTTP exceptions
        return await http_exception_handler(request, exc)


# Custom Validation Error Handler 
# Handles 422 Unprocessable Entity
async def custom_validation_exception_handler(
    request: Request, 
    exc: RequestValidationError
):
    return JSONResponse(
        status_code=422,
        content={
            "error": "LabX Validation failed",
            "details": exc.errors()
        },
    )

async def internal_server_error_handler(
    request: Request, 
    exc: Exception
):
    logger.exception("Internal Server Error occurred")
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "Something unexpected went wrong. Please try again later."
        },
    )