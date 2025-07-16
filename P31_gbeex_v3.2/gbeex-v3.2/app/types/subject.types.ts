export interface Demographics {
    age: number;
    sex: "Male" | "Female";
    ethnicity: string;
    region: string;
}

export interface ClinicalData {
    treatmentArm: string;
    adverseEventsCount: number;
    seriousAdverseEventsCount: number;
}

export interface Milestones {
    screeningDate: string;
    enrollmentDate: string;
    randomizationDate: string;
    lastVisitDate: string;
    endOfStudyDate: string;
}

export interface OperationalData {
    missedVisits: number;
    protocolDeviations: number;
    eCRFStatus: string;
}

export interface Subject {
    subjectId: string;
    status: string;
    demographics: Demographics;
    clinical: ClinicalData;
    milestones: Milestones;
    operational: OperationalData;
}
