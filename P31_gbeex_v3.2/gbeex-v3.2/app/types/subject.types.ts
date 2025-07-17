// \gbeex-v3.2\app\types\subject.types.ts

export interface ProgressMetrics {
    enrolled: number;
    screened: number;
    completed: number;
    dropped: number;
    completionPercentage: number;
}

export interface Subject {
    subjectId: string;
    age: number;
    gender: string;
    ethnicity: string;
    visitCount: number;
    lastVisitDate: string;
    status: string;
    protocolDeviation: boolean;
    dropoutReason: string;
    BMI: number;
    vaccinationStatus: boolean;
    incomeBracket: string;
    educationLevel: string;
    preferredLanguage: string;
    adherenceScore: number;
    digitalEngagementLevel: string;
    progressStatus: string;
    testProgress?: ProgressMetrics;
    complications: string[];
}