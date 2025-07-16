import { Subject } from './subject.types';

export interface Location {
    lat: number;
    lng: number;
}

export interface SitePerformanceSummary {
    status: string;
    enrollmentRatePerMonth: number;
    totalEnrolled: number;
    totalCompleted: number;
    totalWithdrawn: number;
    totalScreenFailures: number;
    avgDataEntryLagDays: number;
}

export interface Site {
    siteId: string;
    siteName: string;
    country: string;
    location: Location;
    sitePerformanceSummary: SitePerformanceSummary;
    subjects: Subject[];
}
