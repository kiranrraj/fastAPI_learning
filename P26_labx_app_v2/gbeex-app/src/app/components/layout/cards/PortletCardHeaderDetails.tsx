// src/app/components/layout/cards/PortletCardHeaderDetails.tsx

import React from "react";
import styles from "./PortletCardHeaderDetails.module.css";

interface PortletCardHeaderDetailsProps {
  title: string;
  portletType: string;
  tagColor?: string;
  status?: "idle" | "loading" | "error" | "success" | "stale";
}

const PortletCardHeaderDetails: React.FC<PortletCardHeaderDetailsProps> = ({
  title,
  portletType,
  tagColor,
  status,
}) => {
  const statusColorMap: Record<string, string> = {
    idle: styles.statusIdle,
    loading: styles.statusLoading,
    success: styles.statusSuccess,
    error: styles.statusError,
    stale: styles.statusStale,
  };

  return (
    <div className={styles.cardMetaRow}>
      {/* Tag color indicator */}
      {tagColor && (
        <span className={styles.tagDot} style={{ backgroundColor: tagColor }} />
      )}
      <h1 className={styles.cardTitle}>{title}</h1>

      {/* Portlet type label */}
      <span className={styles.cardType}>{portletType}</span>
    </div>
  );
};

export default PortletCardHeaderDetails;
