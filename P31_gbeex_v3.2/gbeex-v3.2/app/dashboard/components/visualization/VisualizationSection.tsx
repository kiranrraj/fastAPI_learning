"use client";

import React from "react";
import { useDetailContext } from "@/app/contexts/detail/DetailContext";
import EnrollmentChart from "@/app/dashboard/components/visualization/EnrollmentChart";
import CompletionHeatmap from "@/app/dashboard/components/visualization/CompletionHeatmap";
import DelayBarChart from "@/app/dashboard/components/visualization/DelayBarChart";
import styles from "./VisualizationSection.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function VisualizationSection({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { nodeType } = useDetailContext();

  // Choose which visuals to render based on nodeType
  let visuals: React.ReactNode;
  switch (nodeType) {
    case "company":
      visuals = (
        <>
          <EnrollmentChart /> {/* Enrollment trend across all protocols */}
          <CompletionHeatmap /> {/* World map of protocol completion % */}
        </>
      );
      break;
    case "protocol":
      visuals = (
        <>
          <EnrollmentChart /> {/* Enrollment trend for this protocol */}
          <DelayBarChart /> {/* Bar chart of delay reasons */}
        </>
      );
      break;
    case "site":
      visuals = (
        <>
          <CompletionHeatmap /> {/* Map of subject completion at this site */}
          <DelayBarChart /> {/* Site‑specific delay breakdown */}
        </>
      );
      break;
    default:
      visuals = null;
  }

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
        {visuals}
      </div>
    </section>
  );
}
