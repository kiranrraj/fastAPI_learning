from fastapi import APIRouter, Depends
from models.patient_model import PatientModel
from db.mongo import db
from utils.auth import get_token_header

router = APIRouter()

#### Important
# MongoDB stores _id as a special object type: bson.ObjectId
# FastAPI (and jsonable_encoder) tries to convert the response into a valid JSON object.
# ObjectId is not JSON serializable, so Python will throws an error.
def serialize_mongo_doc(doc):
    # converted the MongoDB _id field to a string. Which is JSON serializable
    doc["_id"] = str(doc["_id"])
    return doc

@router.post("/patients")
async def create_patient(patient: PatientModel, token: str = Depends(get_token_header)):
    await db.patients_1.insert_one(patient.model_dump())
    return {"message": "Patient created"}

@router.get("/patients")
async def list_patients(token: str = Depends(get_token_header)):
    patients = await db.patients_1.find().to_list(100)
    return [serialize_mongo_doc(p) for p in patients]
