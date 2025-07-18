// app/dashboard/components/NodeCardGrid.tsx

import React from "react";
import { Node } from "@/app/types"; // Only Node type is strictly needed here now
import NodeCard from "@/app/dashboard/components/node/NodeCard";
import styles from "./NodeCardGrid.module.css";

const getNodeId = (node: Node): string => {
  if ("companyId" in node) return node.companyId;
  if ("protocolId" in node) return node.protocolId;
  if ("siteId" in node) return node.siteId;
  return node.subjectId;
};

// Removed getNodeSortName as sorting is now handled by the parent component (Overview.tsx)

export default function NodeCardGrid({
  nodes,
  variant = "detail",
}: {
  nodes: Node[];
  variant?: "overview" | "detail";
}) {
  if (!nodes || nodes.length === 0) {
    return <p className={styles.emptyMessage}>This item has no children.</p>;
  }

  // The nodes array is now expected to be already filtered and sorted by the parent.
  return (
    <div className={styles.grid}>
      {nodes.map((node) => (
        <NodeCard key={getNodeId(node)} node={node} variant={variant} />
      ))}
    </div>
  );
}
