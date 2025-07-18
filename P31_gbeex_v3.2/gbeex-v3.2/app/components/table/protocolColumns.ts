// components/table/protocolColumns.ts
import type { Column } from "@/app/types/table.types";

export interface Protocol {
    /** Unique ID */
    id: string;
    /** Human‑readable name */
    name: string;
    /** Number of sites under this protocol */
    siteCount: number;
    /** Number of enrolled subjects */
    enrolled: number;
    /** Completion percentage */
    completionPct: number;
    /** Actual completion date timestamp */
    lastUpdated: string;
}

export const protocolColumns: Column<Protocol>[] = [
    { header: "Protocol Name", accessor: "name" },
    { header: "Sites", accessor: "siteCount" },
    { header: "Enrolled", accessor: "enrolled" },
    { header: "Completion (%)", accessor: "completionPct" },
    { header: "Last Updated", accessor: "lastUpdated" },
];
