from fastapi import APIRouter, Depends
from app.services.doctor_services import DoctorService
from app.models.data import DoctorDataItem
from app.security.dependencies import get_current_doctor_user
from app.routes.utils.register_data_router import register_data_router
from app.database import get_database

router = APIRouter()

# Create a dependency that returns a DoctorService
def doctor_service_dep(db=Depends(get_database)):
    return DoctorService(db)

register_data_router(
    router=router,
    path_prefix="",  
    service_dep=doctor_service_dep,     
    response_model=DoctorDataItem,
    current_user_dependency=get_current_doctor_user
)
