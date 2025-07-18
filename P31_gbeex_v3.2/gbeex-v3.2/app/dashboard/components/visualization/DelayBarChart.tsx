"use client";

import React from "react";
import { useDetailContext } from "@/app/contexts/detail/DetailContext";

/**
 * Placeholder for a bar chart of timeline delay reasons.
 * Consume context.protocol or context.site to count delayReason occurrences.
 */
export default function DelayBarChart() {
  const { nodeType } = useDetailContext();

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
      DelayBarChart placeholder for {nodeType}
    </div>
  );
}
