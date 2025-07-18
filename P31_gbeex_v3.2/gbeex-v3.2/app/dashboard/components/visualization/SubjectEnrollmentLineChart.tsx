// app/dashboard/components/analytics/SubjectEnrollmentLineChart.tsx

"use client"; // Ensure this is a client component
import styles from "./SubjectEnrollmentLineChart.module.css";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

// Define the Subject type needed for this chart
interface Subject {
  subjectId: string;
  lastVisitDate: string;
  status: string;
}

// Define the Site type needed for this chart
interface Site {
  siteId: string;
  siteName: string;
  subjects: Subject[];
}

interface SubjectEnrollmentLineChartProps {
  sites: Site[];
}

const SubjectEnrollmentLineChart: React.FC<SubjectEnrollmentLineChartProps> = ({
  sites,
}) => {
  const enrollmentDataMap = new Map<string, number>();

  sites.forEach((siteItem) => {
    siteItem.subjects.forEach((subject) => {
      if (subject.lastVisitDate) {
        const date = new Date(subject.lastVisitDate);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        enrollmentDataMap.set(
          monthYear,
          (enrollmentDataMap.get(monthYear) || 0) + 1
        );
      }
    });
  });

  // Sort dates and calculate cumulative sum
  const sortedDates = Array.from(enrollmentDataMap.keys()).sort();
  let cumulativeSum = 0;
  const data = sortedDates.map((date) => {
    cumulativeSum += enrollmentDataMap.get(date) || 0;
    return { date, "Cumulative Enrolled Subjects": cumulativeSum };
  });

  if (data.length === 0) {
    return (
      <div className={styles.emptyChartContainer}>
        No subject enrollment data available.
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h4 className={styles.chartTitle}>Subject Enrollment Trends</h4>
      <ResponsiveContainer width="100%" height="calc(100% - 40px)">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className={styles.gridStroke} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            className={styles.axisLabel}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            className={styles.axisLabel}
          >
            <Label
              value="Enrolled Subjects"
              angle={-90}
              position="insideLeft"
              className={styles.yAxisLabel}
            />
          </YAxis>
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e0e0e0",
              fontSize: "0.85rem",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "0.85rem", color: "#4a5568" }} />
          <Line
            type="monotone"
            dataKey="Cumulative Enrolled Subjects"
            stroke="#4f46e5"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubjectEnrollmentLineChart;
