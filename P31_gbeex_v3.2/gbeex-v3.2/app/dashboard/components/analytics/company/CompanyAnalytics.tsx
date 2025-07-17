// app/dashboard/components/DetailViews/CompanyAnalytics.tsx

import React from "react";
import { Company } from "@/app/types";
import styles from "./CompanyAnalytics.module.css";
import { Users, CheckSquare, TrendingUp, AlertCircle } from "lucide-react";

// A reusable card for displaying a single statistic
const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}) => (
  <div
    className={styles.statCard}
    style={{ "--color": color } as React.CSSProperties}
  >
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statContent}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  </div>
);

// The main analytics component
export const CompanyAnalytics = ({ company }: { company: Company }) => {
  // --- Analytics Calculations ---
  let totalSubjects = 0;
  let totalEnrolled = 0;
  let totalCompleted = 0;
  const phaseCounts: { [key: string]: number } = { I: 0, II: 0, III: 0 };
  const delayReasons: { [key: string]: number } = {};
  let totalInfrastructureScore = 0;
  let siteCount = 0;

  company.protocols.forEach((protocol) => {
    if (protocol.phase && protocol.phase in phaseCounts) {
      phaseCounts[protocol.phase]++;
    }

    const pReason = protocol.timelineDelays?.delayReason;
    if (pReason && pReason.toLowerCase() !== "none") {
      delayReasons[pReason] = (delayReasons[pReason] || 0) + 1;
    }

    protocol.sites.forEach((site) => {
      siteCount++;
      totalInfrastructureScore += site.infrastructureScore || 0;
      totalSubjects += site.subjects?.length || 0;

      const sReason = site.timelineDelays?.delayReason;
      if (sReason && sReason.toLowerCase() !== "none") {
        delayReasons[sReason] = (delayReasons[sReason] || 0) + 1;
      }
    });

    totalEnrolled += protocol.progressMetrics?.enrolled || 0;
    totalCompleted += protocol.progressMetrics?.completed || 0;
  });

  const overallCompletionRate =
    totalEnrolled > 0
      ? ((totalCompleted / totalEnrolled) * 100).toFixed(1) + "%"
      : "N/A";
  const avgInfrastructureScore =
    siteCount > 0
      ? (totalInfrastructureScore / siteCount).toFixed(1) + "%"
      : "N/A";
  const topDelayReason =
    Object.entries(delayReasons).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "None";

  return (
    <div className={styles.analyticsContainer}>
      <h3 className={styles.analyticsTitle}>Portfolio Analytics</h3>
      <div className={styles.statsGrid}>
        <StatCard
          icon={<Users />}
          label="Total Subjects"
          value={totalSubjects}
          color="#3b82f6"
        />
        <StatCard
          icon={<CheckSquare />}
          label="Overall Completion"
          value={overallCompletionRate}
          color="#22c55e"
        />
        <StatCard
          icon={<TrendingUp />}
          label="Avg. Site Infrastructure"
          value={avgInfrastructureScore}
          color="#8b5cf6"
        />
        <StatCard
          icon={<AlertCircle />}
          label="Top Delay Reason"
          value={topDelayReason}
          color="#f97316"
        />
      </div>
      <div className={styles.phaseDistribution}>
        <h4 className={styles.distributionTitle}>
          Protocol Phase Distribution
        </h4>
        <div className={styles.phaseBarContainer}>
          {Object.entries(phaseCounts).map(([phase, count]) => (
            <div key={phase} className={styles.phaseItem}>
              <div className={styles.phaseLabel}>Phase {phase}</div>
              <div className={styles.phaseBar}>
                <div
                  className={styles.phaseBarFill}
                  style={{
                    width: `${
                      (count / (company.protocols.length || 1)) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className={styles.phaseCount}>{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
