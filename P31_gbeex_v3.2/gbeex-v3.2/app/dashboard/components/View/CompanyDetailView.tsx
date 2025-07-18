// app/dashboard/components/View/CompanyDetailView.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Company, Protocol as RawProtocol } from "@/app/types";
import styles from "./CompanyDetailView.module.css";
import { Grid as CardIcon, Table as TableIcon } from "lucide-react";
import VisualizationSection from "@/app/dashboard/components/visualization/VisualizationSection";
import { CompanyDetailHeader } from "./CompanyDetailHeader";
import ProtocolCard from "@/app/dashboard/components/children/protocol/ProtocolCard";
import Table from "@/app/components/table/Table";
import {
  protocolColumns,
  Protocol as TableProtocol,
} from "@/app/components/table/protocolColumns";

const CompanyProtocolAnalytics = ({
  protocols,
}: {
  protocols: TableProtocol[];
}) => {
  const totalProtocols = protocols.length;
  const totalEnrolled = protocols.reduce((sum, p) => sum + p.enrolled, 0);
  const avgCompletion =
    totalProtocols > 0
      ? (
          protocols.reduce((sum, p) => sum + p.completionPct, 0) /
          totalProtocols
        ).toFixed(2)
      : "0";

  return (
    <div className={styles.analyticsSection}>
      <h3 className={styles.analyticsTitle}>Protocol Performance Overview</h3>
      <div className={styles.analyticsGrid}>
        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>Total Protocols</p>
          <p className={styles.metricValue}>{totalProtocols}</p>
        </div>
        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>Total Enrolled Subjects</p>
          <p className={styles.metricValue}>{totalEnrolled}</p>
        </div>
        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>Avg. Completion Rate</p>
          <p className={styles.metricValue}>{avgCompletion}%</p>
        </div>
      </div>
    </div>
  );
};

interface Props {
  company: Company & {
    protocols: Array<
      RawProtocol & {
        therapeuticArea?: string;
        phase?: string;
        sites?: any[];
      }
    >;
  };
}

export default function CompanyDetailView({ company }: Props) {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [visualizationCollapsed, setVisualizationCollapsed] = useState(false);

  // Prepare table‐friendly data
  const mappedProtocolsForTable: TableProtocol[] = useMemo(() => {
    return company.protocols.map((p) => ({
      id: p.protocolId,
      name: p.protocolName,
      siteCount: Array.isArray(p.sites) ? p.sites.length : 0,
      enrolled: p.progressMetrics?.enrolled ?? 0,
      completionPct: p.progressMetrics?.completionPercentage ?? 0,
      lastUpdated:
        p.timelineDelays?.actualCompletionDate ??
        p.timelineDelays?.expectedCompletionDate ??
        "",
      therapeuticArea: p.therapeuticArea ?? "N/A",
      phase: p.phase ?? "N/A",
    }));
  }, [company.protocols]);

  // Toggle visualizations panel
  const toggleVisuals = () => setVisualizationCollapsed((prev) => !prev);

  return (
    <div className={styles.container}>
      {/* --- Header + View Switcher --- */}
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

      {/* --- Analytics Section --- */}
      <CompanyProtocolAnalytics protocols={mappedProtocolsForTable} />

      {/* --- Visualization Section --- */}
      <VisualizationSection
        collapsed={visualizationCollapsed}
        onToggle={toggleVisuals}
      />

      {/* --- Protocols Section  --- */}
      <div className={styles.body}>
        {viewMode === "card" ? (
          <div className={styles.grid}>
            {company.protocols.map((protocol) => (
              // Pass the RAW protocol directly to ProtocolCard as it expects the raw type
              <ProtocolCard key={protocol.protocolId} protocol={protocol} />
            ))}
          </div>
        ) : (
          <Table
            columns={protocolColumns}
            data={mappedProtocolsForTable}
            height="500px"
          />
        )}
      </div>
    </div>
  );
}
