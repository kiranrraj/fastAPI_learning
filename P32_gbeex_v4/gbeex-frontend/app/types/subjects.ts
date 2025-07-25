// app/types/subject.ts

export interface VitalSigns {
    bloodPressure: string;
    heartRate: number;
}

export interface EmergencyContact {
    name: string;
    relation: string;
    phone: string;
}

export interface Subject {
    subjectId: string;
    screeningNumber: string;
    medicalRecordNumber: string;
    dateOfConsent: string;
    dateOfEnrollment: string;
    randomizationDate: string;
    treatmentArm: string;
    age: number;
    dateOfBirth: string;
    gender: string;
    ethnicity: string;
    heightCm: number;
    weightKg: number;
    BMI: number;
    bloodType: string;
    smokingStatus: string;
    alcoholConsumption: string;
    drugUse: string;
    comorbidities: string[];
    priorMedications: string[];
    familyHistory: string[];
    allergies: string[];
    dietaryRestrictions: string;
    geneticMarkers: string;
    visitCount: number;
    lastVisitDate: string;
    nextScheduledVisit: string;
    status: string;
    finalStatus: string;
    dateOfLastContact: string;
    previousTrial: boolean;
    progressStatus: string;
    protocolDeviation: boolean;
    discontinuationReason?: string;
    dropoutReason?: string;
    vaccinationStatus: boolean;
    socioeconomicStatus: string;
    incomeBracket: string;
    educationLevel: string;
    adherenceScore: number;
    medicationAdherence: number;
    complications: string;
    vitalSigns: VitalSigns;
    qualityOfLifeScores: number;
    studyDrugDosage: string;
    insuranceProvider: string;
    emergencyContact: EmergencyContact;

    siteId?: string;
    siteName?: string;
    protocolId?: string;
    protocolName?: string;
    companyId?: string;
    companyName?: string;
}