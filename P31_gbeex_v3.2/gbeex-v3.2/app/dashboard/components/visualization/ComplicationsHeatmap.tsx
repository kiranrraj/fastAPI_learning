"use client";

import React from "react";
import styles from "./ComplicationsHeatmap.module.css";

interface HeatCell {
  x: string; // protocolName
  y: string; // complication type
  value: number;
}
interface Props {
  data: HeatCell[];
  xLabels: string[];
  yLabels: string[];
}

export default function ComplicationsHeatmap({
  data,
  xLabels,
  yLabels,
}: Props) {
  // Find max and min for normalization
  const values = data.map((c) => c.value);
  const maxValue = Math.max(0, ...values);
  const minValue = Math.min(0, ...values); // Ensure min is not less than 0 if values are counts

  // look up cell value by x/y
  const getValue = (x: string, y: string): number =>
    data.find((c) => c.x === x && c.y === y)?.value ?? 0;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${
            xLabels.length + 1
          }, minmax(80px, 1fr))`,
          gridTemplateRows: `repeat(${yLabels.length + 1}, 1fr)`,
        }}
      >
        {/* top-left empty cell */}
        <div className={styles.headerCell}></div>

        {/* column headers (protocol names) */}
        {xLabels.map((x) => (
          <div key={x} className={styles.headerCell}>
            {x}
          </div>
        ))}

        {/* rows */}
        {yLabels.map((y) => (
          <React.Fragment key={y}>
            {/* row header */}
            <div className={styles.headerCell}>{y}</div>

            {/* data cells */}
            {xLabels.map((x) => {
              const val = getValue(x, y);
              // Compute hue and lightness for a red-to-yellow gradient
              let normalizedValue = 0;
              if (maxValue > minValue) {
                // Avoid division by zero if all values are the same
                normalizedValue = (val - minValue) / (maxValue - minValue);
              } else if (val === maxValue && maxValue === minValue) {
                normalizedValue = 0.5; // If all values are the same, treat as mid-intensity
              }

              // Hue: 60 (yellow) for low values, 0 (red) for high values
              const hue = 60 - normalizedValue * 60; // 60 (yellow) down to 0 (red)
              const lightness = 90 - normalizedValue * 50; // 90 (light) down to 40 (dark)
              const bg = `hsl(${hue}, 100%, ${lightness}%)`;

              return (
                <div
                  key={x + "|" + y}
                  className={styles.dataCell}
                  style={{ background: bg }}
                  title={val > 0 ? `Value: ${val}` : "No data"} // Add tooltip for interactivity
                >
                  {val > 0 ? val : ""}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
