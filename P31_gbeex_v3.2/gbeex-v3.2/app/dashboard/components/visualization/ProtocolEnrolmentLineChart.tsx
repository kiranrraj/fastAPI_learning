// app/dashboard/components/visualization/ProtocolEnrollmentLineChart.tsx
"use client";

import styles from "./ProtocolEnrollmentLineChart.module.css";
import type { Protocol as RawProtocol } from "@/app/types";
import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProtocolEnrollmentLineChartProps {
  protocols?: RawProtocol[];
}

const ProtocolEnrollmentLineChart: React.FC<
  ProtocolEnrollmentLineChartProps
> = ({ protocols }) => {
  useEffect(() => {
    console.log("ProtocolEnrollmentLineChart received protocols:", protocols);
  }, [protocols]);
  if (!protocols || protocols.length === 0) {
    return (
      <div className={styles.placeholder}>
        No protocol enrollment data available.
      </div>
    );
  }

  // Map protocols into chart‑friendly data
  const data = protocols.map((p) => ({
    name: p.protocolName,
    enrolled: p.progressMetrics?.enrolled ?? 0,
  }));

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Protocol Enrollment Over Protocols</h4>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="enrolled"
              stroke="#4f46e5"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProtocolEnrollmentLineChart;
