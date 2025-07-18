// app/dashboard/components/visualization/ProtocolCompletionPieChart.tsx
"use client";

import React, { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./ProtocolCompletionPieChart.module.css";

// Minimal interface matching the data you pass in
interface PieProtocol {
  protocolId: string;
  name: string;
  completionPct: number;
}

interface ProtocolCompletionPieChartProps {
  protocols?: PieProtocol[];
}

/**
 * Given an index and total count, returns a distinct HSL color.
 * Distributes hues evenly around the 360° color wheel.
 */
function getSliceColor(index: number, total: number): string {
  const hue = Math.round((360 * index) / total);
  return `hsl(${hue}, 65%, 55%)`;
}

export default function ProtocolCompletionPieChart({
  protocols,
}: ProtocolCompletionPieChartProps) {
  // Debug log
  useEffect(() => {
    console.log("ProtocolCompletionPieChart received:", protocols);
  }, [protocols]);

  // Guard: no data
  if (!protocols || protocols.length === 0) {
    return (
      <div className={styles.placeholder}>
        No protocol completion data available.
      </div>
    );
  }

  // Map protocols → recharts data
  const data = protocols.map((p) => ({
    name: p.name,
    value: Number(p.completionPct.toFixed(2)),
  }));

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Protocol Completion Status</h4>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius="70%"
              innerRadius="40%"
              paddingAngle={2}
              label={({ name, percent = 0 }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={getSliceColor(idx, data.length)} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => `${value}%`} />
            <Legend layout="vertical" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
