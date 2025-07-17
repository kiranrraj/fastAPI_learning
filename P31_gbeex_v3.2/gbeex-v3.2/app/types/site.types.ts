// \gbeex-v3.2\app\types\site.types.ts

import { Subject } from './subject.types';
import { TimelineDelays } from './protocol.types';

export interface SitePerformance {
    enrollmentRate: number;
    queryResolutionTime: number;
    protocolDeviationRate: number;
    complicationRate: number;
}

export interface Site {
    siteId: string;
    siteName: string;
    country: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
    investigator: string;
    infrastructureScore: number;
    sitePerformance?: SitePerformance;
    timelineDelays?: TimelineDelays;
    subjects: Subject[];
}