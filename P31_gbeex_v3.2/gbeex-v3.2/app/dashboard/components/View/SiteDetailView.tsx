// app/dashboard/components/DetailViews/SiteDetailView.tsx

import React from "react";
import { Site } from "@/app/types";
import styles from "./SiteDetailView.module.css";
import {
  MapPin,
  Globe,
  User,
  Activity,
  CheckCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className={styles.detailItem}>
    <div className={styles.detailIcon}>{icon}</div>
    <div>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.detailValue}>{value}</div>
    </div>
  </div>
);

export const SiteDetailHeader = ({ site }: { site: Site }) => {
  const enrollmentRate = site.sitePerformance?.enrollmentRate ?? "N/A";
  const deviationRate = site.sitePerformance?.protocolDeviationRate
    ? `${site.sitePerformance.protocolDeviationRate * 100}%`
    : "N/A";
  const queryTime = site.sitePerformance?.queryResolutionTime ?? "N/A";
  const delayReason = site.timelineDelays?.delayReason ?? "None";
  const location = `${site.city}, ${site.state}, ${site.country}`;

  return (
    <div className={styles.detailHeader}>
      <div className={styles.headerTitle}>
        <MapPin size={32} />
        <h2>{site.siteName}</h2>
      </div>
      <div className={styles.headerGrid}>
        <DetailItem icon={<Globe />} label="Location" value={location} />
        <DetailItem
          icon={<User />}
          label="Investigator"
          value={site.investigator}
        />
        <DetailItem
          icon={<Activity />}
          label="Enrollment Rate"
          value={enrollmentRate}
        />
        <DetailItem
          icon={<CheckCircle />}
          label="Infrastructure Score"
          value={`${site.infrastructureScore}%`}
        />
        <DetailItem
          icon={<AlertTriangle />}
          label="Deviation Rate"
          value={deviationRate}
        />
        <DetailItem
          icon={<Calendar />}
          label="Query Time (days)"
          value={queryTime}
        />
        <DetailItem
          icon={<AlertTriangle />}
          label="Delay Reason"
          value={delayReason}
        />
      </div>
    </div>
  );
};
