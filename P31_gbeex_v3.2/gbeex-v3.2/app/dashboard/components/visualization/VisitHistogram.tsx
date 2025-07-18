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
import styles from "./VisitHistogram.module.css";

interface Subject {
  visitCount: number;
}
interface Props {
  data: Subject[];
}

export default function VisitHistogram({ data }: Props) {
  // Build histogram buckets
  const max = Math.max(0, ...data.map((s) => s.visitCount));
  const buckets: { name: string; count: number }[] = [];
  for (let i = 1; i <= max; i++) buckets.push({ name: `${i}`, count: 0 });
  data.forEach((s) => {
    buckets[s.visitCount - 1].count++;
  });

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Visit Count Distribution</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={buckets}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid />
          <XAxis
            dataKey="name"
            label={{ value: "Visits", position: "insideBottom", offset: -5 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
