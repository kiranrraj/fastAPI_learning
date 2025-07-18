"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./EnrollmentCompletionScatter.module.css";

interface Protocol {
  protocolName: string;
  enrolled: number;
  completed: number;
}
interface Props {
  data: Protocol[];
}

export default function EnrollmentCompletionScatter({ data }: Props) {
  const chartData = data.map((p) => ({
    x: p.enrolled,
    y: p.completed,
    name: p.protocolName,
  }));
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Enrolled vs. Completed</h4>
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid />
          <XAxis dataKey="x" name="Enrolled" />
          <YAxis dataKey="y" name="Completed" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={chartData} fill="#4f46e5" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
