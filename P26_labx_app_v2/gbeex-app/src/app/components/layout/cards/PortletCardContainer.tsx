import React, { useEffect, useState } from "react";
import PortletCardHeader from "./PortletCardHeader";
import PortletCardFooter from "./PortletCardFooter";
import PortletCardContent from "./PortletCardContent";
import styles from "./PortletCardContainer.module.css";

import { handleRefresh } from "@/app/utils/cards/handlers/handleRefresh";
import { handleDelete } from "@/app/utils/cards/handlers/handleDelete";
import { handleShare } from "@/app/utils/cards/handlers/handleShare";
import { handleLink } from "@/app/utils/cards/handlers/handleLink";
import { handlePin } from "@/app/utils/cards/handlers/handlePin";
import { handleLock } from "@/app/utils/cards/handlers/handleLock";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinned, setPinned] = useState(isPinned);
  const [locked, setLocked] = useState(isLocked);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => setLocked(isLocked), [isLocked]);
  useEffect(() => setPinned(isPinned), [isPinned]);

  if (deleted) return null;

  return (
    <div className={styles.cardWrapper} data-testid={`card-${cardId}`}>
      <PortletCardHeader
        cardId={cardId}
        title={title}
        portletType={portletType}
        tagColor={tagColor}
        status={loading ? "loading" : status}
        isCollapsed={isCollapsed}
        isPinned={pinned}
        isLocked={locked}
        onRefresh={() =>
          !locked && handleRefresh(cardId, setLoading, onRefresh)
        }
        onDelete={() => !locked && handleDelete(cardId, setDeleted, onDelete)}
        onShare={() => !locked && handleShare(cardId, onShare)}
        onLink={() => !locked && handleLink(cardId, onLink)}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        onTogglePin={() => handlePin(cardId, pinned, setPinned, onTogglePin)}
        onToggleLock={() => handleLock(cardId, locked, setLocked, onToggleLock)}
      />

      {!isCollapsed && (
        <PortletCardContent>
          <div data-testid={`card-content-${cardId}`}>{children}</div>
        </PortletCardContent>
      )}

      <PortletCardFooter lastUpdated={lastUpdated}>{footer}</PortletCardFooter>
    </div>
  );
};

export default PortletCardContainer;
