// app/dashboard/components/DetailViews/ProtocolDetailView.tsx

import React from "react";
import { Protocol } from "@/app/types";
import styles from "./ProtocolDetailView.module.css";
import {
  FlaskConical,
  BarChart2,
  Activity,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
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

export const ProtocolDetailHeader = ({ protocol }: { protocol: Protocol }) => {
  const expectedCompletionDate = protocol.timelineDelays?.expectedCompletionDate
    ? new Date(
        protocol.timelineDelays.expectedCompletionDate
      ).toLocaleDateString()
    : "N/A";

  const delayReason = protocol.timelineDelays?.delayReason ?? "None";

  const enrolled = protocol.progressMetrics?.enrolled ?? "N/A";
  const completed = protocol.progressMetrics?.completed ?? "N/A";
  const completionPercentage = protocol.progressMetrics?.completionPercentage
    ? `${protocol.progressMetrics.completionPercentage}%`
    : "N/A";

  return (
    <div className={styles.detailHeader}>
      <div className={styles.headerTitle}>
        <FlaskConical size={32} />
        <h2>{protocol.protocolName}</h2>
      </div>
      <div className={styles.headerGrid}>
        <DetailItem icon={<BarChart2 />} label="Phase" value={protocol.phase} />
        <DetailItem
          icon={<Activity />}
          label="Therapeutic Area"
          value={protocol.therapeuticArea}
        />
        <DetailItem
          icon={<Calendar />}
          label="Est. Completion"
          value={expectedCompletionDate}
        />
        <DetailItem icon={<User />} label="Enrolled" value={enrolled} />
        <DetailItem
          icon={<CheckCircle />}
          label="Completed"
          value={completed}
        />
        <DetailItem
          icon={<BarChart2 />}
          label="Completion %"
          value={completionPercentage}
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
