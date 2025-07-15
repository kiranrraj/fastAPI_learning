export interface Subject {
    subjectId: string;
    status: string;
    demographics: {
        age: number;
        sex: string;
        ethnicity: string;
        region: string;
    };
    clinical: {
        treatmentArm: string;
        adverseEventsCount: number;
        seriousAdverseEventsCount: number;
    };
    milestones: {
        screeningDate: string;
        enrollmentDate: string;
        randomizationDate: string;
        lastVisitDate: string;
        endOfStudyDate: string;
    };
    operational: {
        missedVisits: number;
        protocolDeviations: number;
        eCRFStatus: string;
    };
}

export interface Site {
    siteId: string;
    siteName: string;
    country: string;
    location: {
        lat: number;
        lng: number;
    };
    sitePerformanceSummary: {
        status: string;
        enrollmentRatePerMonth: number;
        totalEnrolled: number;
        totalCompleted: number;
        totalWithdrawn: number;
        totalScreenFailures: number;
        avgDataEntryLagDays: number;
    };
    subjects: Subject[];
}

export interface Protocol {
    protocolId: string;
    protocolName: string;
    drugName: string;
    phase: string;
    budget: {
        totalBudgetUSD: number;
        costPerPatientUSD: number;
    };
    sites: Site[];
}

export interface Company {
    companyId: string;
    companyName: string;
    protocols: Protocol[];
}
