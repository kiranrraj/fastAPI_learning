from fastapi import APIRouter, Depends
from app.services.admin_services import AdminService
from app.database import get_database
from app.models.data import AdminDataItem
from app.security.dependencies import get_current_admin_user
from app.routes.utils.register_data_router import register_data_router

router = APIRouter()

def admin_service_dep(db=Depends(get_database)):
    return AdminService(db)

register_data_router(
    router=router,
    path_prefix="",
    service_dep=admin_service_dep,       
    response_model=AdminDataItem,
    current_user_dependency=get_current_admin_user
)