// src/app/components/layout/cards/PortletCardHeaderControls.tsx

import React from "react";
import styles from "./PortletCardContainer.module.css";

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

/**
 * PortletCardHeaderControls
 * ---------------------------
 * Row 1: Top row of all control buttons in order.
 * Buttons: Refresh, Share, Link, Pin/Unpin, Lock/Unlock, Collapse/Expand, Delete
 */
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
    <>
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
    </>
  );
};

export default PortletCardHeaderControls;
