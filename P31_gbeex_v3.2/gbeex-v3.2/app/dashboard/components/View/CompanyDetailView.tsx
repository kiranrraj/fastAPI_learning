// app/dashboard/components/View/CompanyDetailView.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Company, Protocol as RawProtocol } from "@/app/types";
import styles from "./CompanyDetailView.module.css";
import { Grid as CardIcon, Table as TableIcon } from "lucide-react";

import { CompanyDetailHeader } from "./CompanyDetailHeader";

// *** IMPORT THE CHILDREN PROTOCOL CARD (raw shape) ***
import ProtocolCard from "@/app/dashboard/components/children/protocol/ProtocolCard";

import Table from "@/app/components/table/Table";
import {
  protocolColumns,
  Protocol as TableProtocol,
} from "@/app/components/table/protocolColumns";

interface Props {
  company: Company & {
    protocols: RawProtocol[]; // raw Protocol type
  };
}

export default function CompanyDetailView({ company }: Props) {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Map raw API protocols into the flat TableProtocol shape
  const tableData: TableProtocol[] = useMemo(() => {
    return company.protocols.map((p) => ({
      id: p.protocolId,
      name: p.protocolName,
      siteCount: p.sites.length,
      enrolled: p.progressMetrics?.enrolled ?? 0, // note 'enrolled'
      completionPct: p.progressMetrics?.completionPercentage ?? 0,
      lastUpdated:
        p.timelineDelays?.actualCompletionDate ??
        p.timelineDelays?.expectedCompletionDate ??
        "",
    }));
  }, [company.protocols]);

  return (
    <div className={styles.container}>
      {/* Header + toggle */}
      <div className={styles.headerWrapper}>
        <CompanyDetailHeader company={company} />

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

      {/* Children: protocols as cards or table */}
      <div className={styles.body}>
        {viewMode === "card" ? (
          <div className={styles.grid}>
            {company.protocols.map((protocol) => (
              // Pass raw protocol into the _children_ card
              <ProtocolCard key={protocol.protocolId} protocol={protocol} />
            ))}
          </div>
        ) : (
          // Table view: use tableData which has the table‑folder shape
          <Table columns={protocolColumns} data={tableData} height="500px" />
        )}
      </div>
    </div>
  );
}
