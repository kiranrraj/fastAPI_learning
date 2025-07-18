"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./DemographicsPieCharts.module.css";

interface DemoSlice {
  name: string;
  value: number;
}
interface Props {
  genderData: DemoSlice[];
  ethnicityData: DemoSlice[];
  incomeData: DemoSlice[];
}

const COLORS = ["#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];

export default function DemographicsPieCharts({
  genderData,
  ethnicityData,
  incomeData,
}: Props) {
  const renderPie = (data: DemoSlice[], title: string) => (
    <div className={styles.chart}>
      <h5 className={styles.subTitle}>{title}</h5>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={50}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className={styles.container}>
      {renderPie(genderData, "Gender")}
      {renderPie(ethnicityData, "Ethnicity")}
      {renderPie(incomeData, "Income")}
    </div>
  );
}
