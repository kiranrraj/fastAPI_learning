// app/dashboard/components/DetailViews/SiteAnalytics.tsx

import React from "react";
import { Site } from "@/app/types";
import styles from "./SiteAnalytics.module.css";
import { AlertTriangle } from "lucide-react";

export const SiteAnalytics = ({ site }: { site: Site }) => {
  // --- Analytics Calculations ---
  const subjectStatusCounts: { [key: string]: number } = {
    Ongoing: 0,
    Completed: 0,
    Dropped: 0,
  };
  const complicationCounts: { [key: string]: number } = {};
  let totalSubjects = 0;

  site.subjects?.forEach((subject) => {
    totalSubjects++;
    if (subject.status && subject.status in subjectStatusCounts) {
      subjectStatusCounts[subject.status]++;
    }
    subject.complications?.forEach((comp) => {
      if (comp.toLowerCase() !== "none") {
        complicationCounts[comp] = (complicationCounts[comp] || 0) + 1;
      }
    });
  });

  const topComplications = Object.entries(complicationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className={styles.analyticsContainer}>
      <h3 className={styles.analyticsTitle}>Site Analytics</h3>
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
        <h4 className={styles.chartTitle}>Top Reported Complications</h4>
        <ul className={styles.topList}>
          {topComplications.length > 0 ? (
            topComplications.map(([comp, count]) => (
              <li key={comp}>
                <span>{comp}</span>
                <span className={styles.listValue}>
                  <AlertTriangle size={16} />
                  {count} case(s)
                </span>
              </li>
            ))
          ) : (
            <li>No complications reported.</li>
          )}
        </ul>
      </div>
    </div>
  );
};
