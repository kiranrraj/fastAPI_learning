"use client";

import React from "react";
import { useDetailContext } from "@/app/contexts/detail/DetailContext";

/**
 * Placeholder for a world‑map heatmap of completion %.
 * Consume context.company or context.site to color‑code locations.
 */
export default function CompletionHeatmap() {
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
      CompletionHeatmap placeholder for {nodeType}
    </div>
  );
}
