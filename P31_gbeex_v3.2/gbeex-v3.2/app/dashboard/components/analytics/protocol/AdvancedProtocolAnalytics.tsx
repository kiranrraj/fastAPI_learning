// app/dashboard/components/DetailViews/AdvancedProtocolAnalytics.tsx

import React from "react";
import { Protocol } from "@/app/types";
import styles from "@/app/dashboard/components/analytics/protocol/AdvancedProtocolAnalytics.module.css";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const PerfListItem = ({
  item,
  value,
  icon,
  valueColor,
}: {
  item: string;
  value: string | number;
  icon: React.ReactNode;
  valueColor?: string;
}) => (
  <li>
    <span>{item}</span>
    <span className={styles.perfValue} style={{ color: valueColor }}>
      {icon}
      {value}
    </span>
  </li>
);

export const AdvancedProtocolAnalytics = ({
  protocol,
}: {
  protocol: Protocol;
}) => {
  const sitesByEnrollment = [...protocol.sites].sort(
    (a, b) =>
      (b.sitePerformance?.enrollmentRate ?? 0) -
      (a.sitePerformance?.enrollmentRate ?? 0)
  );
  const topPerformers = sitesByEnrollment.slice(0, 3);
  const bottomPerformers = sitesByEnrollment.slice(-3).reverse();

  let totalDelay = 0;
  let sitesWithDelay = 0;
  protocol.sites.forEach((s) => {
    if (s.timelineDelays) {
      const expected = new Date(s.timelineDelays.expectedCompletionDate);
      const actual = new Date(s.timelineDelays.actualCompletionDate);
      const delay =
        (actual.getTime() - expected.getTime()) / (1000 * 3600 * 24);
      if (delay > 0) {
        totalDelay += delay;
        sitesWithDelay++;
      }
    }
  });

  const avgDelay =
    sitesWithDelay > 0
      ? `${(totalDelay / sitesWithDelay).toFixed(1)} days`
      : "On Track";

  return (
    <div className={styles.analyticsContainer}>
      <h3 className={styles.analyticsTitle}>Advanced Protocol Analytics</h3>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock />
          </div>
          <div>
            <div className={styles.statValue}>{avgDelay}</div>
            <div className={styles.statLabel}>Avg. Site Delay</div>
          </div>
        </div>
      </div>
      <div className={styles.distributionGrid}>
        <div className={styles.distributionContainer}>
          <h4 className={styles.analyticsSubtitle}>Top Performing Sites</h4>
          <ul className={styles.distributionList}>
            {topPerformers.map((s) => (
              <PerfListItem
                key={s.siteId}
                item={s.siteName}
                value={s.sitePerformance?.enrollmentRate.toFixed(2) ?? "N/A"}
                icon={<TrendingUp size={16} />}
                valueColor="#16a34a"
              />
            ))}
          </ul>
        </div>
        <div className={styles.distributionContainer}>
          <h4 className={styles.analyticsSubtitle}>Sites Needing Attention</h4>
          <ul className={styles.distributionList}>
            {bottomPerformers.map((s) => (
              <PerfListItem
                key={s.siteId}
                item={s.siteName}
                value={s.sitePerformance?.enrollmentRate.toFixed(2) ?? "N/A"}
                icon={<TrendingDown size={16} />}
                valueColor="#dc2626"
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
