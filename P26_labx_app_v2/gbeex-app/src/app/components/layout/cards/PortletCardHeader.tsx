// src/app/components/layout/cards/PortletCardHeader.tsx

import React from "react";
import PortletCardHeaderControls from "./PortletCardHeaderControls";
import PortletCardHeaderDetails from "./PortletCardHeaderDetails";
import styles from "./PortletCardContainer.module.css";

interface PortletCardHeaderProps {
  title: string;
  portletType: string;
  tagColor?: string;
  status?: "idle" | "loading" | "error" | "success" | "stale";
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
 * PortletCardHeader
 * ------------------
 * Three-row header layout:
 * 1. Top row: Controls (Refresh, Share, Link, Pin, Lock, Collapse, Delete)
 * 2. Second row: Main title
 * 3. Third row: Portlet type, tags, group labels (if any)
 */
const PortletCardHeader: React.FC<PortletCardHeaderProps> = ({
  title,
  portletType,
  tagColor,
  status,
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
    <div className={styles.cardHeader}>
      {/* Row 1: Button controls */}
      <div className={styles.cardControls}>
        <PortletCardHeaderControls
          isCollapsed={isCollapsed}
          isPinned={isPinned}
          isLocked={isLocked}
          onRefresh={onRefresh}
          onDelete={onDelete}
          onShare={onShare}
          onLink={onLink}
          onToggleCollapse={onToggleCollapse}
          onTogglePin={onTogglePin}
          onToggleLock={onToggleLock}
        />
      </div>

      {/* Row 2: Main title */}
      <div className={styles.cardTitleRow}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>

      {/* Row 3: Tags, type, status */}
      <PortletCardHeaderDetails
        title={title}
        portletType={portletType}
        tagColor={tagColor}
        status={status}
      />
    </div>
  );
};

export default PortletCardHeader;
