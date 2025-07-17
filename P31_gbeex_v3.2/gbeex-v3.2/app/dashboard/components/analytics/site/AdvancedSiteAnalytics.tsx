// app/dashboard/components/DetailViews/AdvancedSiteAnalytics.tsx

import React from "react";
import { Site } from "@/app/types";
import styles from "@/app/dashboard/components/analytics/site/AdvancedSiteAnalytics.module.css";
import { User, Users, ShieldCheck, Activity } from "lucide-react";

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}>{icon}</div>
    <div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  </div>
);

export const AdvancedSiteAnalytics = ({ site }: { site: Site }) => {
  let totalAge = 0;
  const genderCounts: { [key: string]: number } = {
    Male: 0,
    Female: 0,
    Other: 0,
  };
  let complicationCount = 0;

  site.subjects.forEach((s) => {
    totalAge += s.age;
    if (s.gender && s.gender in genderCounts) {
      genderCounts[s.gender]++;
    }
    if (
      s.complications &&
      s.complications.length > 0 &&
      s.complications[0].toLowerCase() !== "none"
    ) {
      complicationCount++;
    }
  });

  const avgAge =
    site.subjects.length > 0
      ? (totalAge / site.subjects.length).toFixed(1)
      : "N/A";
  const complicationRate =
    site.subjects.length > 0
      ? `${((complicationCount / site.subjects.length) * 100).toFixed(1)}%`
      : "0%";
  const dataQualityScore =
    (1 - (site.sitePerformance?.protocolDeviationRate ?? 0)) * 100 -
    (site.sitePerformance?.queryResolutionTime ?? 0);

  return (
    <div className={styles.analyticsContainer}>
      <h3 className={styles.analyticsTitle}>Advanced Site Analytics</h3>
      <div className={styles.statsGrid}>
        <StatCard icon={<User />} label="Avg. Subject Age" value={avgAge} />
        <StatCard
          icon={<Users />}
          label="Gender Distribution"
          value={`M: ${genderCounts.Male} / F: ${genderCounts.Female}`}
        />
        <StatCard
          icon={<Activity />}
          label="Adverse Event Rate"
          value={complicationRate}
        />
        <StatCard
          icon={<ShieldCheck />}
          label="Data Quality Score"
          value={dataQualityScore.toFixed(1)}
        />
      </div>
    </div>
  );
};
