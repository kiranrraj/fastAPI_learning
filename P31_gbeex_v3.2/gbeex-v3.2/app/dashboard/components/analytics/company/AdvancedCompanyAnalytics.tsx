// app/dashboard/components/DetailViews/AdvancedCompanyAnalytics.tsx

import React from "react";
import { Company } from "@/app/types";
import styles from "@/app/dashboard/components/analytics/company/AdvancedCompanyAnalytics.module.css";
import {
  DollarSign,
  Users,
  Map,
  Activity,
  BarChart3,
  Globe,
} from "lucide-react";

const StatCard = ({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
}) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}>{icon}</div>
    <div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {subValue && <div className={styles.statSubValue}>{subValue}</div>}
    </div>
  </div>
);

const DistributionList = ({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number }[];
}) => (
  <div className={styles.distributionContainer}>
    <h4 className={styles.analyticsSubtitle}>{title}</h4>
    <ul className={styles.distributionList}>
      {items.map((item) => (
        <li key={item.label}>
          <span>{item.label}</span>
          <span className={styles.distributionValue}>{item.value}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const AdvancedCompanyAnalytics = ({ company }: { company: Company }) => {
  let totalBudget = 0;
  let totalSubjects = 0;
  const siteDistribution: { [key: string]: number } = {};
  const therapeuticAreaCounts: { [key: string]: number } = {};

  company.protocols.forEach((p) => {
    totalBudget += p.progressMetrics?.enrolled
      ? p.progressMetrics.enrolled * 25000
      : 0; // Mock budget calculation
    p.sites.forEach((s) => {
      totalSubjects += s.subjects?.length || 0;
      siteDistribution[s.country] = (siteDistribution[s.country] || 0) + 1;
    });
    therapeuticAreaCounts[p.therapeuticArea] =
      (therapeuticAreaCounts[p.therapeuticArea] || 0) + 1;
  });

  const costPerSubject =
    totalSubjects > 0
      ? `$${(totalBudget / totalSubjects).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`
      : "N/A";
  const sortedSiteDistribution = Object.entries(siteDistribution)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  const sortedTherapeuticAreas = Object.entries(therapeuticAreaCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className={styles.analyticsContainer}>
      <h3 className={styles.analyticsTitle}>Advanced Portfolio Analytics</h3>
      <div className={styles.statsGrid}>
        <StatCard
          icon={<DollarSign />}
          label="Total Estimated Budget"
          value={`$${totalBudget.toLocaleString()}`}
        />
        <StatCard
          icon={<Users />}
          label="Cost Per Subject"
          value={costPerSubject}
        />
      </div>
      <div className={styles.distributionGrid}>
        <DistributionList
          title="Site Distribution by Country"
          items={sortedSiteDistribution}
        />
        <DistributionList
          title="Therapeutic Area Focus"
          items={sortedTherapeuticAreas}
        />
      </div>
    </div>
  );
};
