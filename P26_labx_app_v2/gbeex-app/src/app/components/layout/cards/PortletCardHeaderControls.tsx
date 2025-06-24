// src/app/components/layout/cards/PortletCardHeaderControls.tsx

/**
 * PortletCardHeaderControls
 * Buttons: Refresh, Share, Link, Pin/Unpin, Lock/Unlock, Collapse/Expand, Delete
 */

import React from "react";
import styles from "./PortletCardHeaderControls.module.css";

interface PortletCardHeaderControlsProps {
  isCollapsed?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  onRefresh?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onLink?: () => void;
  onToggleCollapse?: () => void;
  onTogglePin?: () => void;
  onToggleLock?: () => void;
}

const PortletCardHeaderControls: React.FC<PortletCardHeaderControlsProps> = ({
  isCollapsed,
  isPinned,
  isLocked,
  onRefresh,
  onDelete,
  onShare,
  onLink,
  onToggleCollapse,
  onTogglePin,
  onToggleLock,
}) => {
  return (
    <div className={styles.buttonGroup}>
      <button className={styles.controlButton} onClick={onRefresh}>
        Refresh
      </button>
      <button className={styles.controlButton} onClick={onShare}>
        Share
      </button>
      <button className={styles.controlButton} onClick={onLink}>
        Link
      </button>
      <button className={styles.controlButton} onClick={onTogglePin}>
        {isPinned ? "Unpin" : "Pin"}
      </button>
      <button className={styles.controlButton} onClick={onToggleLock}>
        {isLocked ? "Unlock" : "Lock"}
      </button>
      <button className={styles.controlButton} onClick={onToggleCollapse}>
        {isCollapsed ? "Expand" : "Collapse"}
      </button>
      <button
        className={styles.controlButton}
        onClick={onDelete}
        disabled={isLocked}
      >
        Delete
      </button>
    </div>
  );
};

export default PortletCardHeaderControls;
