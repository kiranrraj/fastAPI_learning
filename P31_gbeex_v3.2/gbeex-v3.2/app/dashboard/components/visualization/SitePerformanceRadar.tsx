"use client";

import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import styles from "./SitePerformanceRadar.module.css";

interface SitePerf {
  metric: string;
  value: number;
}
interface Props {
  data: SitePerf[];
  name: string;
}

export default function SitePerformanceRadar({ data, name }: Props) {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{name} Performance</h4>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} />
          <Tooltip />
          <Radar
            name={name}
            dataKey="value"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
