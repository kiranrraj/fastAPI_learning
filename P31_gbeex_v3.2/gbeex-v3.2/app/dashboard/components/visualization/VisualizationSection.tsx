// app/dashboard/components/visualization/VisualizationSection.tsx
"use client";

import React, { useMemo } from "react";
import { useDetailContext } from "@/app/contexts/detail/DetailContext";
import styles from "./VisualizationSection.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";

// Charts
import ProtocolEnrollmentLineChart from "@/app/dashboard/components/visualization/ProtocolEnrolmentLineChart";

// Raw API types
import type { Protocol as RawProtocol } from "@/app/types";

export default function VisualizationSection({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { nodeType, company, protocol } = useDetailContext();

  // Decide which protocols to feed into the chart:
  // – If we're viewing a company, chart all its protocols
  // – If we're viewing a single protocol, chart just that one
  const protocolsForChart: RawProtocol[] = useMemo(() => {
    if (nodeType === "company" && company) {
      return company.protocols;
    }
    if (nodeType === "protocol" && protocol) {
      return [protocol];
    }
    return [];
  }, [nodeType, company, protocol]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Visualizations</h2>
        <button onClick={onToggle} aria-label="Toggle visuals">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      <div
        className={`${styles.body} ${
          collapsed ? styles.collapsed : styles.expanded
        }`}
      >
        {!collapsed && (
          <>
            {/* Protocol Enrollment Line Chart */}
            <ProtocolEnrollmentLineChart protocols={protocolsForChart} />
          </>
        )}
      </div>
    </section>
  );
}
