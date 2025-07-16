import React from "react";
import { Node } from "@/app/types";
import NodeCard from "./NodeCard";
import styles from "./NodeCardGrid.module.css";

const getNodeId = (node: Node): string => {
  if ("companyId" in node) return node.companyId;
  if ("protocolId" in node) return node.protocolId;
  if ("siteId" in node) return node.siteId;
  return node.subjectId;
};

export default function NodeCardGrid({ nodes }: { nodes: Node[] }) {
  if (!nodes || nodes.length === 0) {
    return <p className={styles.emptyMessage}>This item has no children.</p>;
  }

  return (
    <div className={styles.grid}>
      {nodes.map((node) => (
        <NodeCard key={getNodeId(node)} node={node} />
      ))}
    </div>
  );
}
