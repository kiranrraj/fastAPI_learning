// src/app/components/layout/cards/PortletCardContainer.tsx

import React, { useEffect, useState } from "react";
import PortletCardHeader from "./PortletCardHeader";
import PortletCardFooter from "./PortletCardFooter";
import styles from "./PortletCardContainer.module.css";
import PortletCardContent from "./PortletCardContent";

interface PortletCardContainerProps {
  cardId: string;
  title: string;
  portletType: string;
  tagColor?: string;
  status?: "idle" | "loading" | "error" | "success" | "stale";
  lastUpdated?: string;
  isPinned?: boolean;
  isLocked?: boolean;

  onRefresh?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  onLink?: (id: string) => void;
  onTogglePin?: (id: string, pinned: boolean) => void;
  onToggleLock?: (id: string, locked: boolean) => void;

  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * PortletCardContainer Component
 * ---------------------------------
 * This is the main container for each portlet card.
 * It renders:
 *  - Header (with all control handlers)
 *  - Collapsible body section (children content)
 *  - Optional footer (last updated info or extra nodes)
 */
const PortletCardContainer: React.FC<PortletCardContainerProps> = ({
  cardId,
  title,
  portletType,
  tagColor,
  status,
  lastUpdated,
  isPinned = false,
  isLocked = false,
  onRefresh,
  onDelete,
  onShare,
  onLink,
  onTogglePin,
  onToggleLock,
  children,
  footer,
}) => {
  // State to toggle collapse/expand content
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Collapse toggle handler
  const handleCollapseToggle = () => setIsCollapsed((prev) => !prev);

  //========== DEBUGGING SECTION ==========
  //   useEffect(() => {
  //     console.groupCollapsed(
  //       `[PortletCardContainer] Props for cardId: ${cardId}`
  //     );
  //     console.log("  title:", title);
  //     console.log("  portletType:", portletType);
  //     console.log("  tagColor:", tagColor);
  //     console.log("  status:", status);
  //     console.log("  lastUpdated:", lastUpdated);
  //     console.log("  isPinned:", isPinned);
  //     console.log("  isLocked:", isLocked);
  //     console.log("  children (raw JSX):", children);
  //     console.log("  footer (raw JSX):", footer);
  //     console.groupEnd();
  //   }, [cardId]);

  return (
    <div className={styles.cardWrapper} data-testid={`card-${cardId}`}>
      {/* === HEADER === */}
      <PortletCardHeader
        title={title}
        portletType={portletType}
        tagColor={tagColor}
        status={status}
        isCollapsed={isCollapsed}
        isPinned={isPinned}
        isLocked={isLocked}
        onRefresh={() => onRefresh?.(cardId)}
        onDelete={() => onDelete?.(cardId)}
        onShare={() => onShare?.(cardId)}
        onLink={() => onLink?.(cardId)}
        onToggleCollapse={handleCollapseToggle}
        onTogglePin={() => onTogglePin?.(cardId, !isPinned)}
        onToggleLock={() => onToggleLock?.(cardId, !isLocked)}
      />

      {/* === BODY === */}
      {!isCollapsed && (
        <PortletCardContent>
          <div data-testid={`card-content-${cardId}`}>{children}</div>
        </PortletCardContent>
      )}

      {/* === FOOTER === */}
      <PortletCardFooter lastUpdated={lastUpdated}>{footer}</PortletCardFooter>
    </div>
  );
};

export default PortletCardContainer;
