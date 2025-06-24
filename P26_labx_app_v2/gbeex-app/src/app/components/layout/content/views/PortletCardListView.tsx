// src/app/components/layout/content/views/PortletCardListView.tsx

"use client";

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import PortletCardContainer from "@/app/components/layout/cards/PortletCardContainer";
import styles from "./PortletCardListView.module.css";

interface PortletCardListViewProps {
  title?: string;
  items: PortletNode[];
  renderContent?: (item: PortletNode) => React.ReactNode; // <- Optional content renderer
}

/**
 * PortletCardListView
 * --------------------
 * Renders a grid of PortletCardContainer components.
 * Each card renders children using renderContent(item) if provided.
 */
const PortletCardListView: React.FC<PortletCardListViewProps> = ({
  title,
  items,
  renderContent,
}) => {
  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.cardGrid}>
        {items.map((item) => (
          <PortletCardContainer
            key={item.id}
            cardId={item.id}
            title={item.name}
            portletType={item.portletType ?? "Unknown"}
            tagColor={item.tagColor ?? "#888"}
            status="idle"
            lastUpdated="Just now"
            onRefresh={() => console.log("Refresh", item.id)}
            onDelete={() => console.log("Delete", item.id)}
            onLink={() => console.log("Link", item.id)}
            onShare={() => console.log("Share", item.id)}
            onTogglePin={(id, pinned) => console.log("Pin toggle", id, pinned)}
            onToggleLock={(id, locked) =>
              console.log("Lock toggle", id, locked)
            }
          >
            {renderContent ? (
              renderContent(item)
            ) : (
              <div className={styles.cardMeta}>
                Placeholder for portlet content.
              </div>
            )}
          </PortletCardContainer>
        ))}
      </div>
    </div>
  );
};

export default PortletCardListView;
