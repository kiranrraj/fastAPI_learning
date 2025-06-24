// src/app/components/layout/content/views/GroupContentView.tsx

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import styles from "./GroupContentView.module.css";
import { getChildItemsForGroup } from "@/app/utils/common/getChildItemsForGroup";

interface GroupContentViewProps {
  groupNode: PortletNode;
  allNodes: Record<string, PortletNode>;
  isDefaultTab?: boolean;
}

/**
 * GroupContentView
 * -----------------
 * Displays a single group's content and its children.
 * Uses shared utility to resolve children reliably.
 */
const GroupContentView: React.FC<GroupContentViewProps> = ({
  groupNode,
  allNodes,
}) => {
  const childNodes = getChildItemsForGroup(groupNode.id, allNodes);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.groupTitle}>{groupNode.name}</h2>

      {childNodes.length === 0 ? (
        <p className={styles.emptyMessage}>
          No children available for this group.
        </p>
      ) : (
        <div className={styles.grid}>
          {childNodes.map((child) => (
            <div key={child.id} className={styles.childCard}>
              <h3 className={styles.childName}>{child.name}</h3>
              <p className={styles.childMeta}>
                Type: {child.portletType || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupContentView;
