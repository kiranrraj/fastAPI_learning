import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import PortletCardContainer from "@/app/components/layout/cards/PortletCardContainer";

interface ItemContentViewProps {
  itemNode: PortletNode;

  onRefresh?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  onLink?: (id: string) => void;
  onTogglePin?: (id: string, pinned: boolean) => void;
  onToggleLock?: (id: string, locked: boolean) => void;
  onCloseTab?: (id: string) => void;
}

const ItemContentView: React.FC<ItemContentViewProps> = ({
  itemNode,
  onRefresh,
  onDelete,
  onShare,
  onLink,
  onTogglePin,
  onToggleLock,
  onCloseTab,
}) => {
  if (!itemNode) {
    return <div>No item found.</div>;
  }

  return (
    <PortletCardContainer
      cardId={itemNode.id}
      title={itemNode.name}
      portletType={itemNode.type}
      tagColor={itemNode.tagColor}
      status="idle"
      lastUpdated={itemNode.lastUpdated}
      isPinned={itemNode.pinned}
      isLocked={itemNode.locked}
      onRefresh={onRefresh}
      onDelete={(id) => {
        onDelete?.(id);
        onCloseTab?.(id);
      }}
      onShare={onShare}
      onLink={onLink}
      onTogglePin={onTogglePin}
      onToggleLock={onToggleLock}
      footer={
        <div style={{ fontSize: 12, color: "#666" }}>
          Last updated: {itemNode.lastUpdated || "N/A"}
        </div>
      }
    >
      {/* Pass content as children */}
      {JSON.stringify(itemNode)}
    </PortletCardContainer>
  );
};

export default ItemContentView;
