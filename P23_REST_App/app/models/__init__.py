from .labx_patient_model import PatientCreate, PatientUpdate, PatientRead
from .labx_branch_model import BranchCreate, BranchUpdate, BranchRead
from .labx_staff_model import StaffCreate, StaffUpdate, StaffRead
from .labx_order_model import OrderCreate, OrderUpdate, OrderRead
from .labx_result_model import ResultCreate, ResultUpdate, ResultRead
from .labx_investigation_model import InvestigationCreate, InvestigationUpdate, InvestigationRead
from .labx_investigation_group_model import (
    InvestigationGroupCreate,
    InvestigationGroupUpdate,
    InvestigationGroupRead,
)

# Optional bundling for centralized access
PatientModel = (PatientCreate, PatientUpdate, PatientRead)
BranchModel = (BranchCreate, BranchUpdate, BranchRead)
StaffModel = (StaffCreate, StaffUpdate, StaffRead)
OrderModel = (OrderCreate, OrderUpdate, OrderRead)
ResultModel = (ResultCreate, ResultUpdate, ResultRead)
InvestigationModel = (InvestigationCreate, InvestigationUpdate, InvestigationRead)
InvestigationGroupModel = (InvestigationGroupCreate, InvestigationGroupUpdate, InvestigationGroupRead)

__all__ = [
    # individual models
    "PatientCreate", "PatientUpdate", "PatientRead",
    "BranchCreate", "BranchUpdate", "BranchRead",
    "StaffCreate", "StaffUpdate", "StaffRead",
    "OrderCreate", "OrderUpdate", "OrderRead",
    "ResultCreate", "ResultUpdate", "ResultRead",
    "InvestigationCreate", "InvestigationUpdate", "InvestigationRead",
    "InvestigationGroupCreate", "InvestigationGroupUpdate", "InvestigationGroupRead",

    # model bundles
    "PatientModel", "BranchModel", "StaffModel",
    "OrderModel", "ResultModel", "InvestigationModel", "InvestigationGroupModel"
]
