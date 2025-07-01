import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import PortletCardContainer from "@/app/components/layout/cards/PortletCardContainer";
import styles from "./ItemContentView.module.css";

interface ItemContentViewProps {
  itemNode: PortletNode;
}

const ItemContentView: React.FC<ItemContentViewProps> = ({ itemNode }) => {
  if (!itemNode) {
    return <div className={styles.emptyMessage}>Item not found.</div>;
  }

  return (
    <div className={styles.container}>
      <PortletCardContainer
        cardId={itemNode.id}
        title={itemNode.name}
        portletType={itemNode.portletType ?? "Unknown"}
        tagColor={itemNode.tagColor ?? "#888"}
        status="idle"
        lastUpdated="Just now"
      >
        <div className={styles.itemContent}>
          {itemNode.description ||
            "Detailed view of this item will be rendered here."}
        </div>
      </PortletCardContainer>
    </div>
  );
};

export default ItemContentView;
