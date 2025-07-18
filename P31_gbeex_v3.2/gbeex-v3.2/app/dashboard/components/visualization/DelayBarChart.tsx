"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./DelayBarChart.module.css";

// Props: protocols or sites with expected/actual dates and reason
interface DelayItem {
  id: string;
  label: string;
  expected: number; // timestamp or days
  actual: number;
  reason: string;
}
interface DelayBarChartProps {
  data: DelayItem[];
}
export default function DelayBarChart({ data }: DelayBarChartProps) {
  // Map data to chart array: { name, expected, actual }
  const chartData = data.map((d) => ({
    name: d.label,
    expected: d.expected,
    actual: d.actual,
  }));
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Timeline Delays</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="expected" fill="#8884d8" name="Expected" />
          <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
