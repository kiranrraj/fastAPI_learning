// app/dashboard/components/sidebar/CompanyTreeNode.tsx

import React, { useContext } from "react";
import { Company, Protocol, Site, Subject } from "@/app/types";
import { SidebarContext } from "@/app/contexts/sidebar/SidebarContext";
import { CompanyContext } from "@/app/contexts/company/CompanyContext";
import ExpandCollapseToggle from "@/app/dashboard/components/Sidebar/ExpandCollapseToggle";
import NodeActions from "@/app/dashboard/components/node/NodeActions";
import { Star } from "lucide-react";
import styles from "./CompanyTreeNode.module.css";

type Node = Company | Protocol | Site | Subject;

const getNodeId = (node: Node): string => {
  if ("companyId" in node) return node.companyId;
  if ("protocolId" in node) return node.protocolId;
  if ("siteId" in node) return node.siteId;
  return node.subjectId;
};

const getNodeName = (node: Node): string => {
  if ("companyName" in node) return node.companyName;
  if ("protocolName" in node) return node.protocolName;
  if ("siteName" in node) return node.siteName;
  return node.subjectId;
};

const getNodeChildren = (node: Node): Node[] => {
  if ("protocols" in node) return node.protocols;
  if ("sites" in node) return node.sites;
  if ("subjects" in node) return node.subjects;
  return [];
};

const CompanyTreeNode = ({ node, level }: { node: Node; level: number }) => {
  const { expandedNodeIds, toggleNodeExpansion, hiddenIds, favoriteIds } =
    useContext(SidebarContext)!;

  const { handleNodeSelect } = useContext(CompanyContext)!;

  const nodeId = getNodeId(node);
  const nodeName = getNodeName(node);
  const children = getNodeChildren(node);
  const isExpanded = expandedNodeIds.has(nodeId);
  const isHidden = hiddenIds.has(nodeId);
  const isFavorite = favoriteIds.has(nodeId);

  if (isHidden) return null;

  return (
    <div className={styles.node}>
      <div className={styles.label} style={{ paddingLeft: `${level * 20}px` }}>
        <div className={styles.title}>
          <ExpandCollapseToggle
            isLeaf={children.length === 0}
            isExpanded={isExpanded}
            onClick={() => toggleNodeExpansion(nodeId)}
          />

          <span className={styles.name} onClick={() => handleNodeSelect(node)}>
            {nodeName}
          </span>

          {isFavorite && (
            <Star
              size={14}
              fill="#facc15"
              stroke="#facc15"
              className={styles.star}
            />
          )}
        </div>

        <NodeActions nodeId={nodeId} />
      </div>

      {isExpanded && children.length > 0 && (
        <div className={styles.children}>
          {children.map((child) => (
            <CompanyTreeNode
              key={getNodeId(child)}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyTreeNode;
