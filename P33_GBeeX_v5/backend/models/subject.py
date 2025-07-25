# models/subject.py

from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime


class VitalSigns(BaseModel):
    bloodPressure: str
    heartRate:     int

class EmergencyContact(BaseModel):
    name:     str
    relation: str
    phone:    str

class Subject(BaseModel):
    model_config = ConfigDict(extra="ignore")

    subjectId:            str
    screeningNumber:      str
    medicalRecordNumber:  str
    dateOfConsent:        datetime
    dateOfEnrollment:     datetime
    randomizationDate:    datetime
    treatmentArm:         str
    age:                  int
    dateOfBirth:          datetime
    gender:               str
    ethnicity:            str
    heightCm:             int
    weightKg:             int
    BMI:                  float
    bloodType:            str
    smokingStatus:        str
    alcoholConsumption:   str
    drugUse:              str
    comorbidities:        List[str]
    priorMedications:     List[str]
    familyHistory:        List[str]
    allergies:            List[str]
    dietaryRestrictions:  str
    geneticMarkers:       str
    visitCount:           int
    lastVisitDate:        datetime
    nextScheduledVisit:   datetime
    status:               str
    finalStatus:          Optional[str]
    dateOfLastContact:    datetime
    previousTrial:        Optional[str]
    progressStatus:       str

    protocolDeviation:    str
    discontinuationReason: Optional[str]
    dropoutReason:        Optional[str]
    vaccinationStatus:    str
    socioeconomicStatus:  str
    incomeBracket:        str
    educationLevel:       str
    adherenceScore:       float
    medicationAdherence:  float
    complications:        str
    vitalSigns:           VitalSigns
    qualityOfLifeScores:  float
    studyDrugDosage:      str
    insuranceProvider:    str
    emergencyContact:     EmergencyContact

    @field_validator("previousTrial", "protocolDeviation", "vaccinationStatus", mode="before")
    def bools_to_str(cls, v):
        if isinstance(v, bool):
            return str(v)
        return v
