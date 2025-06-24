// src/app/components/layout/cards/PortletCardFooter.tsx

import React from "react";
import styles from "./PortletCardContainer.module.css";

interface PortletCardFooterProps {
  lastUpdated?: string;
  children?: React.ReactNode;
}

/**
 * PortletCardFooter
 * -------------------
 * Footer section of the card.
 * - Shows last updated time
 * - Optional slot for additional footer controls
 */
const PortletCardFooter: React.FC<PortletCardFooterProps> = ({
  lastUpdated,
  children,
}) => {
  return (
    <div className={styles.cardFooter}>
      {/* Left side: last update time */}
      <div className={styles.lastUpdated}>
        {lastUpdated ? `Last updated: ${lastUpdated}` : ""}
      </div>

      {/* Right side: optional controls (e.g. download, save) */}
      <div className={styles.footerControls}>{children}</div>
    </div>
  );
};

export default PortletCardFooter;
