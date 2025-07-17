// app/dashboard/components/DetailViews/ProtocolAnalytics.tsx

import React from "react";
import { Protocol } from "@/app/types";
import styles from "./ProtocolAnalytics.module.css";
import { BarChart, UserCheck, UserX, TrendingUp } from "lucide-react";

// The main analytics component for a Protocol
export const ProtocolAnalytics = ({ protocol }: { protocol: Protocol }) => {
  // --- Analytics Calculations ---
  const subjectStatusCounts: { [key: string]: number } = {
    Ongoing: 0,
    Completed: 0,
    Dropped: 0,
  };
  let totalSubjects = 0;

  protocol.sites.forEach((site) => {
    site.subjects?.forEach((subject) => {
      totalSubjects++;
      if (subject.status && subject.status in subjectStatusCounts) {
        subjectStatusCounts[subject.status]++;
      }
    });
  });

  // Sort sites by enrollment rate to find the top performers
  const topSites = [...protocol.sites]
    .sort(
      (a, b) =>
        (b.sitePerformance?.enrollmentRate ?? 0) -
        (a.sitePerformance?.enrollmentRate ?? 0)
    )
    .slice(0, 3);

  return (
    <div className={styles.analyticsContainer}>
      <h3 className={styles.analyticsTitle}>Protocol Analytics</h3>
      <div className={styles.chartContainer}>
        <h4 className={styles.chartTitle}>Subject Status Distribution</h4>
        <div className={styles.barChart}>
          {Object.entries(subjectStatusCounts).map(([status, count]) => (
            <div key={status} className={styles.barItem}>
              <div className={styles.barLabel}>{status}</div>
              <div className={styles.bar}>
                <div
                  className={`${styles.barFill} ${
                    styles[status.toLowerCase()]
                  }`}
                  style={{ width: `${(count / (totalSubjects || 1)) * 100}%` }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.listContainer}>
        <h4 className={styles.chartTitle}>
          Top Performing Sites (by Enrollment)
        </h4>
        <ul className={styles.topList}>
          {topSites.map((site) => (
            <li key={site.siteId}>
              <span>{site.siteName}</span>
              <span className={styles.listValue}>
                <TrendingUp size={16} />
                {site.sitePerformance?.enrollmentRate.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
