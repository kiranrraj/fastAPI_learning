# app/core/memory.py
from uuid import UUID
from typing import Dict

from app.models.patient import Patient
from app.models.staff import Staff
from app.models.investigation import Investigation
from app.models.investigation_result import InvestigationResult
from app.models.investigation_group import InvestigationGroup
from app.models.branch import Branch

# In-memory databases
patients_db: Dict[UUID, Patient] = {}
staff_db: Dict[UUID, Staff] = {}
investigations_db: Dict[UUID, Investigation] = {}
results_db: Dict[UUID, InvestigationResult] = {}
groups_db: Dict[UUID, InvestigationGroup] = {}
branches_db: Dict[UUID, Branch] = {}
