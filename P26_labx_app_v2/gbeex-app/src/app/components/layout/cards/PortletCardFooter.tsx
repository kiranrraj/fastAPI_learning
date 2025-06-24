// src/app/components/layout/cards/PortletCardFooter.tsx

import React from "react";
import styles from "./PortletCardFooter.module.css";

interface PortletCardFooterProps {
  lastUpdated?: string;
  children?: React.ReactNode;
}

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

      {/* Right side: optional controls */}
      <div className={styles.footerControls}>{children}</div>
    </div>
  );
};

export default PortletCardFooter;
