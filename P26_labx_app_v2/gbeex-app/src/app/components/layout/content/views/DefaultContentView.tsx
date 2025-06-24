// src/app/components/layout/content/views/DefaultContentView.tsx

"use client";

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import PortletCardContainer from "../../cards/PortletCardContainer";
import PortletCardContent from "../../cards/PortletCardContent";
import styles from "./DefaultContentView.module.css";
import { getChildItemsForGroup } from "@/app/utils/common/getChildItemsForGroup";

interface DefaultContentViewProps {
  portletData: PortletNode[];
}

/**
 * DefaultContentView
 * -------------------
 * Displays all group-type portlets as cards.
 * Each card shows the items that belong to that group.
 */
const DefaultContentView: React.FC<DefaultContentViewProps> = ({
  portletData,
}) => {
  const groupNodes = portletData.filter((node) => node.type === "group");
  const portletMap = Object.fromEntries(portletData.map((n) => [n.id, n]));

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Dashboard</h1>

      {groupNodes.map((group) => {
        const childItems = getChildItemsForGroup(group.id, portletMap);

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
