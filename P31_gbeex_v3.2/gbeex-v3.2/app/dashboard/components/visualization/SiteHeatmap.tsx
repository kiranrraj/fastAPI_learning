// app/dashboard/components/analytics/SiteHeatmap.tsx
"use client";

import React from "react";
import styles from "./SiteHeatmap.module.css";

interface SiteHeatCell {
  // Renamed to match the data structure from VisualizationSection
  xId: string; // Unique ID for the x-axis item (siteId)
  xName: string; // Display name for the x-axis item (siteName)
  y: string; // Metric Name (e.g., "Enrollment Rate")
  value: number;
}

interface Props {
  data: SiteHeatCell[]; // Updated to expect SiteHeatCell[]
  xLabels: { id: string; name: string }[]; // Updated to expect { id: string; name: string }[]
  yLabels: string[];
}

export default function SiteHeatmap({ data, xLabels, yLabels }: Props) {
  // Find max and min for normalization
  const values = data.map((c) => c.value);
  const maxValue = Math.max(0, ...values);
  const minValue = Math.min(0, ...values);

  // look up cell value by xId/y
  const getValue = (xId: string, y: string): number =>
    data.find((c) => c.xId === xId && c.y === y)?.value ?? 0;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${
            xLabels.length + 1
          }, minmax(100px, 1fr))`,
          gridTemplateRows: `repeat(${yLabels.length + 1}, 1fr)`,
        }}
      >
        {/* top-left empty cell */}
        <div className={styles.headerCell}></div>

        {/* column headers (Site Names) */}
        {xLabels.map((xItem) => (
          <div key={xItem.id} className={styles.headerCell}>
            {" "}
            {/* Use xItem.id for unique key */}
            {xItem.name} {/* Display xItem.name */}
          </div>
        ))}

        {/* rows */}
        {yLabels.map((y) => (
          <React.Fragment key={y}>
            {/* row header (Metric Names) */}
            <div key={y} className={styles.headerCell}>
              {y}
            </div>{" "}
            {/* Added key to row header */}
            {/* data cells */}
            {xLabels.map((xItem) => {
              const val = getValue(xItem.id, y); // Use xItem.id for lookup
              let normalizedValue = 0;
              if (maxValue > minValue) {
                normalizedValue = (val - minValue) / (maxValue - minValue);
              } else if (val === maxValue && maxValue === minValue) {
                normalizedValue = 0.5;
              }

              // Red to Yellow gradient
              const hue = 60 - normalizedValue * 60;
              const lightness = 90 - normalizedValue * 50;
              const bg = `hsl(${hue}, 100%, ${lightness}%)`;

              return (
                <div
                  key={xItem.id + "|" + y} // Use xItem.id for unique key
                  className={styles.dataCell}
                  style={{ background: bg }}
                  title={val > 0 ? `${y}: ${val.toFixed(1)}` : "No data"}
                >
                  {val > 0 ? val.toFixed(1) : ""} {/* Display value, rounded */}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
