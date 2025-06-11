# app/models/data.py
from app.models.base import AppBaseModel

# AdminDataItem defines the structure of a document that belongs to 
# the "admin" role-based collection. GET /data/admin Endpoint: When an 
# admin user accesses this endpoint, the data retrieved from the 
# admin_data MongoDB collection will be validated against this 
# AdminDataItem model before being returned in the API response.
class AdminDataItem(AppBaseModel):
    id: int
    name: str
    description: str

class DoctorDataItem(AppBaseModel):
    id: int
    patient_name: str
    diagnosis: str
    medication: str

class TestCenterDataItem(AppBaseModel):
    id: int
    test_type: str
    results: str
    date: str