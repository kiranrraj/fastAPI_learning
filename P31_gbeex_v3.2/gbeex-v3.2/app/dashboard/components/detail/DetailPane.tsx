// app/dashboard/components/detail/DetailPane.tsx
"use client";

import React, { ReactNode } from "react";
import { useDetailContext } from "@/app/contexts/detail/DetailContext";
import styles from "./DetailPane.module.css";
import ChildrenSection from "@/app/dashboard/components/children/ChildrenSection";
import AnalyticsSection from "@/app/dashboard/components/analytics/AnalyticsSection";
import VisualizationSection from "@/app/dashboard/components/visualization/VisualizationSection";

interface DetailPaneProps {
  /** The node‐specific header (company/protocol/site info block) */
  detailHeader: ReactNode;
}

export default function DetailPane({ detailHeader }: DetailPaneProps) {
  const {
    viewMode,
    setViewMode,
    analyticsCollapsed,
    setAnalyticsCollapsed,
    visualizationCollapsed,
    setVisualizationCollapsed,
  } = useDetailContext();

  return (
    <div className={styles.container}>
      {/* Node detail header (formerly “header”) */}
      <div className={styles.detailHeaderSection}>{detailHeader}</div>

      {/* Child list (cards or table) */}
      <ChildrenSection viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Analytics panel */}
      <AnalyticsSection
        collapsed={analyticsCollapsed}
        onToggle={() => setAnalyticsCollapsed(!analyticsCollapsed)}
      />

      {/* Visualization panel */}
      <VisualizationSection
        collapsed={visualizationCollapsed}
        onToggle={() => setVisualizationCollapsed(!visualizationCollapsed)}
      />
    </div>
  );
}
