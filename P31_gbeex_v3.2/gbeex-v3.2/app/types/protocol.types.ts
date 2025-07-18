// \gbeex-v3.2\app\types\protocol.types.ts

import { Site } from "./site.types";
import { ProgressMetrics } from "./subject.types";

export interface TimelineDelays {
    expectedCompletionDate: string;
    actualCompletionDate: string;
    delayReason: string;
}

export interface Protocol {
    protocolId: string;
    protocolName: string;
    therapeuticArea: string;
    phase: string;
    timelineDelays?: TimelineDelays;
    progressMetrics: ProgressMetrics;
    sites: Site[];
}