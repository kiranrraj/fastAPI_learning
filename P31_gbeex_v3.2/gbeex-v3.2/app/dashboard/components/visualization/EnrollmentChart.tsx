"use client";

import React from "react";
import { useDetailContext } from "@/app/contexts/detail/DetailContext";

/**
 * Placeholder for an enrollment‑over‑time chart.
 * Consume context to get the right data slice (company or protocol).
 */
export default function EnrollmentChart() {
  const { nodeType, company, protocol } = useDetailContext();

  // TODO: derive time‑series data from company.protocols or protocol.progressMetrics

  return (
    <div
      style={{
        height: "300px",
        border: "1px dashed #9ca3af",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6b7280",
        fontStyle: "italic",
      }}
    >
      EnrollmentChart placeholder for {nodeType}
    </div>
  );
}
