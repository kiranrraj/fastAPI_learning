// src/app/components/layout/cards/PortletCardHeader.tsx

import React from "react";
import PortletCardHeaderControls from "./PortletCardHeaderControls";
import PortletCardHeaderDetails from "./PortletCardHeaderDetails";
import styles from "./PortletCardHeader.module.css";

interface PortletCardHeaderProps {
  cardId: string;
  title: string;
  portletType: string;
  tagColor?: string;
  status?: "idle" | "loading" | "error" | "success" | "stale";
  isCollapsed: boolean;
  isPinned: boolean;
  isLocked: boolean;

  onRefresh: () => void;
  onDelete: () => void;
  onShare: () => void;
  onLink: () => void;
  onToggleCollapse: () => void;
  onTogglePin: () => void;
  onToggleLock: () => void;
}

const PortletCardHeader: React.FC<PortletCardHeaderProps> = ({
  cardId,
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
      {/* Row 1: Controls */}
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
      {/* Row 3: Details */}
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
