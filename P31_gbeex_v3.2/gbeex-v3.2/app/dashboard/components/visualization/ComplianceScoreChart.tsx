// app/dashboard/components/analytics/ComplianceScoreChart.tsx

"use client"; // Ensure this is a client component

import React, { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { CompanyContext } from "@/app/contexts/company/CompanyContext"; // Import CompanyContext
import styles from "./ComplianceScoreChart.module.css";

// Define the Company type needed for this chart
interface Company {
  companyId: string;
  companyName: string;
  complianceScore: number;
}

const ComplianceScoreChart: React.FC = () => {
  // Get the full list of companies from CompanyContext
  const companyContext = useContext(CompanyContext);

  // --- TEMPORARY MOCK DATA FOR TESTING ---
  // Replace this with your actual data source once testing is complete
  const mockCompanies: Company[] = [
    { companyId: "C1", companyName: "PharmaCorp", complianceScore: 95 },
    { companyId: "C2", companyName: "BioGen", complianceScore: 60 },
    { companyId: "C3", companyName: "MediTech", complianceScore: 82 },
    { companyId: "C4", companyName: "HealthLink", complianceScore: 45 },
    { companyId: "C5", companyName: "GlobalRx", complianceScore: 78 },
    { companyId: "C6", companyName: "InnovateBio", complianceScore: 91 },
    { companyId: "C7", companyName: "CarePlus", complianceScore: 55 },
  ];
  // Use mockCompanies for testing, or actual companies if available
  const companies = companyContext?.companies || mockCompanies;
  const isLoading = companyContext?.isLoading || false; // Assume not loading if using mock

  // --- END TEMPORARY MOCK DATA ---

  // Handle loading state or no companies available
  if (isLoading || companies.length === 0) {
    return (
      <div className={styles.emptyChartContainer}>
        {isLoading
          ? "Loading company data..."
          : "No company data available for compliance distribution."}
      </div>
    );
  }

  // Prepare data for the chart: Group ALL companies by score ranges for clearer distribution.
  const data = [
    { name: "<50%", count: 0 },
    { name: "50-69%", count: 0 },
    { name: "70-89%", count: 0 },
    { name: "90-100%", count: 0 },
  ];

  companies.forEach((company) => {
    const score = company.complianceScore;
    if (score < 50) {
      data[0].count++;
    } else if (score >= 50 && score < 70) {
      data[1].count++;
    } else if (score >= 70 && score < 90) {
      data[2].count++;
    } else {
      // 90-100%
      data[3].count++;
    }
  });

  // If no companies fall into any category, display empty message
  const totalCount = data.reduce((sum, entry) => sum + entry.count, 0);
  if (totalCount === 0) {
    return (
      <div className={styles.emptyChartContainer}>
        No compliance data available for distribution.
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h4 className={styles.chartTitle}>
        Compliance Score Distribution Across All Companies
      </h4>
      <ResponsiveContainer width="100%" height="calc(100% - 40px)">
        <BarChart
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
            dataKey="name"
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
              value="Number of Companies"
              angle={-90}
              position="insideLeft"
              className={styles.yAxisLabel}
            />
          </YAxis>
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e0e0e0",
              fontSize: "0.85rem",
            }}
          />
          <Bar
            dataKey="count"
            fill="#4f46e5"
            barSize={30}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplianceScoreChart;
