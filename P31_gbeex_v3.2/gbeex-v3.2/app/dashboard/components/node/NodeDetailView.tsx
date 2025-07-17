// app/dashboard/components/NodeDetailView.tsx

import React from "react";
import { Node, Company, Protocol, Site, Subject } from "@/app/types";
import NodeCardGrid from "./NodeCardGrid";
import { CompanyDetailHeader } from "@/app/dashboard/components/View/CompanyDetailView";
import { ProtocolDetailHeader } from "@/app/dashboard/components/View/ProtocolDetailView";
import { SiteDetailHeader } from "@/app/dashboard/components/View/SiteDetailView";
import { SubjectDetail } from "@/app/dashboard/components/View/SubjectDetailView";
import styles from "./NodeDetailView.module.css";

// Helper to get the children of any given node
const getNodeChildren = (node: Node): Node[] => {
  if ("protocols" in node) return node.protocols;
  if ("sites" in node) return node.sites;
  if ("subjects" in node) return node.subjects;
  return [];
};

// Helper to get the name for the children section
const getChildrenTypeName = (node: Node): string => {
  if ("companyId" in node) return "Protocols";
  if ("protocolId" in node) return "Sites";
  if ("siteId" in node) return "Subjects";
  return "";
};

// This component now acts as a router to the correct detail view.
export default function NodeDetailView({ node }: { node: Node }) {
  // If the node is a subject, render its specific detail view and stop, as it has no children.
  if ("subjectId" in node) {
    return <SubjectDetail subject={node as Subject} />;
  }

  // --- FIX: Get the children from the node ---
  const children = getNodeChildren(node);
  const childrenTypeName = getChildrenTypeName(node);

  // Dynamically render the correct header based on the node type.
  const renderHeader = () => {
    if ("companyId" in node)
      return <CompanyDetailHeader company={node as Company} />;
    if ("protocolId" in node)
      return <ProtocolDetailHeader protocol={node as Protocol} />;
    if ("siteId" in node) return <SiteDetailHeader site={node as Site} />;
    return null;
  };

  return (
    <div className={styles.container}>
      {/* Render the header with the parent's details */}
      {renderHeader()}

      {/* --- FIX: Render the section for the children cards --- */}
      <div className={styles.childrenSection}>
        <h3 className={styles.childrenTitle}>
          {childrenTypeName} ({children.length})
        </h3>
        <NodeCardGrid nodes={children} variant="detail" />
      </div>
    </div>
  );
}
