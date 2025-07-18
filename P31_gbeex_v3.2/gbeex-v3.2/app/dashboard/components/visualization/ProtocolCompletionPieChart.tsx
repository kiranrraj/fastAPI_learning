// app/dashboard/components/analytics/ProtocolCompletionPieChart.tsx

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./ProtocolCompletionPieChart.module.css"; // Import the new CSS module

// Define the Protocol type needed for this chart
interface Protocol {
  protocolId: string;
  name: string;
  completionPct: number;
}

interface ProtocolCompletionPieChartProps {
  protocols: Protocol[];
}

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#6b7280"]; // Green, Orange, Red, Gray

const ProtocolCompletionPieChart: React.FC<ProtocolCompletionPieChartProps> = ({
  protocols,
}) => {
  // Categorize protocols by completion status
  const completed = protocols.filter((p) => p.completionPct >= 100).length;
  const inProgress = protocols.filter(
    (p) => p.completionPct > 0 && p.completionPct < 100
  ).length;
  const notStarted = protocols.filter((p) => p.completionPct === 0).length;

  // categorize by completion ranges for more detail
  const data = [
    { name: "Completed (100%)", value: completed },
    { name: "In Progress (0-99%)", value: inProgress },
    { name: "Not Started (0%)", value: notStarted },
  ].filter((item) => item.value > 0);

  return (
    <div className={styles.chartContainer}>
      <h4 className={styles.chartTitle}>Protocol Completion Status</h4>
      <ResponsiveContainer width="100%" height="calc(100% - 40px)">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e0e0e0",
              fontSize: "0.85rem",
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: "0.85rem", color: "#4a5568" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProtocolCompletionPieChart;
