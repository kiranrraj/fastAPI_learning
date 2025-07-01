"use client";

import React from "react";
import {
  RefreshCcw,
  Share2,
  Link,
  Pin,
  PinOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
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
      <button
        className={styles.controlButton}
        onClick={onRefresh}
        title="Refresh"
      >
        <RefreshCcw size={12} />
      </button>

      <button className={styles.controlButton} onClick={onShare} title="Share">
        <Share2 size={12} />
      </button>

      <button
        className={styles.controlButton}
        onClick={onLink}
        title="Get Link"
      >
        <Link size={12} />
      </button>

      <button
        className={styles.controlButton}
        onClick={onTogglePin}
        title={isPinned ? "Unpin" : "Pin"}
      >
        {isPinned ? <PinOff size={12} /> : <Pin size={12} />}
      </button>

      <button
        className={styles.controlButton}
        onClick={onToggleLock}
        title={isLocked ? "Unlock" : "Lock"}
      >
        {isLocked ? <Unlock size={12} /> : <Lock size={12} />}
      </button>

      <button
        className={styles.controlButton}
        onClick={onToggleCollapse}
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>

      <button
        className={styles.controlButton}
        onClick={onDelete}
        title="Delete"
        disabled={isLocked}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
};

export default PortletCardHeaderControls;
