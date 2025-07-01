import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import styles from "./GroupContentView.module.css";
import { getChildItemsForGroup } from "@/app/utils/common/getChildItemsForGroup";
import PortletCardContainer from "@/app/components/layout/cards/PortletCardContainer";

interface GroupContentViewProps {
  groupNode: PortletNode;
  allNodes: Record<string, PortletNode>;

  onRefresh?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  onLink?: (id: string) => void;
  onTogglePin?: (id: string, pinned: boolean) => void;
  onToggleLock?: (id: string, locked: boolean) => void;
}

const GroupContentView: React.FC<GroupContentViewProps> = ({
  groupNode,
  allNodes,
  onRefresh,
  onDelete,
  onShare,
  onLink,
  onTogglePin,
  onToggleLock,
}) => {
  const childNodes = getChildItemsForGroup(groupNode.id, allNodes);

  if (childNodes.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        No children available for this group.
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {childNodes.map((child) => (
        <PortletCardContainer
          key={child.id}
          cardId={child.id}
          title={child.name}
          portletType={child.type}
          tagColor={child.tagColor}
          status="idle"
          lastUpdated={child.lastUpdated}
          isPinned={child.pinned}
          isLocked={child.locked}
          onRefresh={onRefresh}
          onDelete={onDelete}
          onShare={onShare}
          onLink={onLink}
          onTogglePin={onTogglePin}
          onToggleLock={onToggleLock}
          footer={<div>Additional info for {child.name}</div>}
        >
          <div className={styles.groupContent}>
            {child.description || "Portlet content goes here."}
          </div>
        </PortletCardContainer>
      ))}
    </div>
  );
};

export default GroupContentView;
