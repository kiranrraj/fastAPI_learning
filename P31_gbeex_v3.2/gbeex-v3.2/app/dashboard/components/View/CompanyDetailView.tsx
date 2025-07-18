import React, { useState, useMemo } from "react";
import { Company } from "@/app/types";
import styles from "./CompanyDetailView.module.css";
import { Grid as CardIcon, Table as TableIcon } from "lucide-react";

import { CompanyDetailHeader } from "@/app/dashboard/components/View/CompanyDetailHeader";
import ProtocolCard from "@/app/dashboard/components/Cards/ProtocolCard";
import Table from "@/app/components/table/Table";
import {
  protocolColumns,
  Protocol,
} from "@/app/components/table/protocolColumns";

interface Props {
  company: Company & {
    // raw from API, with nested fields
    protocols: Array<{
      protocolId: string;
      protocolName: string;
      sites: any[];
      progressMetrics?: {
        enrolled?: number;
        completionPercentage?: number;
      };
      timelineDelays?: {
        actualCompletionDate?: string;
      };
    }>;
  };
}

export default function CompanyDetailView({ company }: Props) {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Map raw API protocols into our flat Protocol interface
  const protocols = useMemo<Protocol[]>(
    () =>
      company.protocols.map((p) => ({
        id: p.protocolId,
        name: p.protocolName,
        siteCount: Array.isArray(p.sites) ? p.sites.length : 0,
        enrolled: p.progressMetrics?.enrolled ?? 0,
        completionPct: p.progressMetrics?.completionPercentage ?? 0,
        lastUpdated: p.timelineDelays?.actualCompletionDate ?? "",
      })),
    [company.protocols]
  );

  return (
    <div className={styles.container}>
      {/* Company header */}
      <div className={styles.headerWrapper}>
        <CompanyDetailHeader company={company} />

        {/* Toggle for child protocols */}
        <div className={styles.viewSwitch}>
          <button
            onClick={() => setViewMode("card")}
            className={viewMode === "card" ? styles.active : ""}
            aria-label="Card View"
          >
            <CardIcon size={20} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? styles.active : ""}
            aria-label="Table View"
          >
            <TableIcon size={20} />
          </button>
        </div>
      </div>

      {/* Protocols list */}
      <div className={styles.body}>
        {viewMode === "card" ? (
          <div className={styles.grid}>
            {protocols.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} />
            ))}
          </div>
        ) : (
          <Table columns={protocolColumns} data={protocols} height="500px" />
        )}
      </div>
    </div>
  );
}
