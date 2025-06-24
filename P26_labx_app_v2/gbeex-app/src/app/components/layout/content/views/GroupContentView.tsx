// src/app/components/layout/content/views/GroupContentView.tsx

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import styles from "./GroupContentView.module.css"; // CSS module for styling

/**
 * Props for GroupContentView
 */
interface GroupContentViewProps {
  groupNode: PortletNode;
  allNodes: Record<string, PortletNode>;
  isDefaultTab?: boolean; // If true, fallback logic will be used for children
}

/**
 * GroupContentView
 * -----------------
 * Renders a group portlet and its children.
 * If `isDefaultTab` is true, child items are resolved dynamically.
 */
const GroupContentView: React.FC<GroupContentViewProps> = ({
  groupNode,
  allNodes,
  isDefaultTab = false,
}) => {
  let childNodes: PortletNode[] = [];

  // Use fallback if this is being rendered in the default tab
  if (isDefaultTab) {
    childNodes = Object.values(allNodes).filter(
      (node) =>
        node.type === "item" &&
        (node.group_ids?.includes(groupNode.id) ||
          node.parentIds?.includes(groupNode.id))
    );
  } else if (groupNode.childIds?.length) {
    childNodes = groupNode.childIds
      .map((id) => allNodes[id])
      .filter((node): node is PortletNode => !!node);
  }

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
