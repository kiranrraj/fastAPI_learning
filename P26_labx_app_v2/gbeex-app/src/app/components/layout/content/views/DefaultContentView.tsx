// src/app/components/layout/content/views/DefaultContentView.tsx

"use client";

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import PortletCardContainer from "../../cards/PortletCardContainer";
import PortletCardContent from "../../cards/PortletCardContent";
import styles from "./DefaultContentView.module.css";

interface DefaultContentViewProps {
  portletData: PortletNode[];
}

/**
 * DefaultContentView
 * -------------------
 * Renders all group-type portlets as cards, with child item names.
 * This view is only shown when no other tab is selected.
 */
const DefaultContentView: React.FC<DefaultContentViewProps> = ({
  portletData,
}) => {
  // Get all group-type nodes
  const groupNodes = portletData.filter((node) => node.type === "group");

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Dashboard</h1>

      {/* Render each group and its children in a card */}
      {groupNodes.map((group) => {
        // Get children using group_ids if present, otherwise fall back to parentIds
        const childItems = portletData.filter((item) => {
          if (item.type !== "item") return false;

          const belongsToGroup =
            item.group_ids?.includes(group.id) ||
            item.parentIds?.includes(group.id);

          return belongsToGroup;
        });

        return (
          <PortletCardContainer
            key={group.id}
            cardId={group.id}
            title={group.name}
            portletType={group.type}
            tagColor="#888"
            status="idle"
            lastUpdated="Just now"
          >
            <PortletCardContent>
              {childItems.length > 0 ? (
                <ul className={styles.itemList}>
                  {childItems.map((item) => (
                    <li key={item.id} className={styles.itemEntry}>
                      {item.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>No items in this group.</p>
              )}
            </PortletCardContent>
          </PortletCardContainer>
        );
      })}
    </div>
  );
};

export default DefaultContentView;
