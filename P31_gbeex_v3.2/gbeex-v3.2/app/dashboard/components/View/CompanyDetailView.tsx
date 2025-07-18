// app/dashboard/components/View/CompanyDetailView.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Company, Protocol as RawProtocol } from "@/app/types";
import styles from "./CompanyDetailView.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import VisualizationSection from "@/app/dashboard/components/visualization/VisualizationSection";
import ProtocolCard from "@/app/dashboard/components/children/protocol/ProtocolCard";
import Table from "@/app/components/table/Table";
import {
  protocolColumns,
  Protocol as TableProtocol,
} from "@/app/components/table/protocolColumns";
import CompanyProtocolDisplayHeader from "./CompanyProtocolDisplayHeader"; // Updated import

// New props for collapsibility
const CompanyProtocolAnalytics = ({
  protocols,
  collapsed,
  onToggle,
}: {
  protocols: TableProtocol[];
  collapsed: boolean;
  onToggle: () => void;
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
      <div className={styles.sectionHeader}>
        <h3 className={styles.analyticsTitle}>Protocol Performance Overview</h3>
        <button onClick={onToggle} aria-label="Toggle analytics">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      <div
        className={`${styles.collapsibleBody} ${
          collapsed ? styles.collapsed : styles.expanded
        }`}
      >
        {!collapsed && (
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
        )}
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
  const [visualizationCollapsed, setVisualizationCollapsed] = useState(true);
  const [analyticsCollapsed, setAnalyticsCollapsed] = useState(true);
  const [protocolsCollapsed, setProtocolsCollapsed] = useState(true);

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

  // Toggle functions
  const toggleVisuals = () => setVisualizationCollapsed((prev) => !prev);
  const toggleAnalytics = () => setAnalyticsCollapsed((prev) => !prev);
  const toggleProtocols = () => setProtocolsCollapsed((prev) => !prev);

  return (
    <div className={styles.container}>
      {/* --- Header (separate component) --- */}
      <CompanyProtocolDisplayHeader
        company={company}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* --- Analytics Section (collapsible) --- */}
      <CompanyProtocolAnalytics
        protocols={mappedProtocolsForTable}
        collapsed={analyticsCollapsed}
        onToggle={toggleAnalytics}
      />

      {/* --- Visualization Section (collapsible) --- */}
      <VisualizationSection
        collapsed={visualizationCollapsed}
        onToggle={toggleVisuals}
      />

      {/* --- Protocols Section (collapsible) --- */}
      <div className={styles.protocolsSection}>
        <div className={styles.sectionHeader}>
          <h3>Protocols</h3>
          {/* View switch for protocols section */}
          <div className={styles.viewSwitch}>
            {/* Note: Icons (CardIcon, TableIcon) are not imported here as they are used in CompanyProtocolDisplayHeader.
                If you need them specifically for this viewSwitch, you will need to import them again here. */}
            <button
              onClick={() => setViewMode("card")}
              className={viewMode === "card" ? styles.active : ""}
              aria-label="Card View"
            >
              {/* Placeholder for icon if needed */}
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={viewMode === "table" ? styles.active : ""}
              aria-label="Table View"
            >
              {/* Placeholder for icon if needed */}
            </button>
          </div>
          <button onClick={toggleProtocols} aria-label="Toggle protocols">
            {protocolsCollapsed ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </button>
        </div>
        <div
          className={`${styles.collapsibleBody} ${
            protocolsCollapsed ? styles.collapsed : styles.expanded
          }`}
        >
          {!protocolsCollapsed &&
            (viewMode === "card" ? (
              <div className={styles.grid}>
                {company.protocols.map((protocol) => (
                  <ProtocolCard key={protocol.protocolId} protocol={protocol} />
                ))}
              </div>
            ) : (
              <Table
                columns={protocolColumns}
                data={mappedProtocolsForTable}
                height="500px"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
