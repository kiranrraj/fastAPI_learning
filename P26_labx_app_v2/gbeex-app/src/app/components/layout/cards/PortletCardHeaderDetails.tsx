// src/app/components/layout/cards/PortletCardHeaderDetails.tsx

import React from "react";
import styles from "./PortletCardContainer.module.css";

interface PortletCardHeaderDetailsProps {
  title: string;
  portletType: string;
  tagColor?: string;
  status?: "idle" | "loading" | "error" | "success" | "stale";
}

/**
 * PortletCardHeaderDetails
 * --------------------------
 * Row 3 of the header showing:
 * - Tag dot color (if present)
 * - Portlet type (e.g., table, graph)
 * - Optional status indicator dot
 */
const PortletCardHeaderDetails: React.FC<PortletCardHeaderDetailsProps> = ({
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

      {/* Portlet type label */}
      <span className={styles.cardType}>{portletType}</span>

      {/* Optional status dot */}
      {status && (
        <span className={`${styles.statusDot} ${statusColorMap[status]}`} />
      )}
    </div>
  );
};

export default PortletCardHeaderDetails;
