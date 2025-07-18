// app/dashboard/components/NodeDetailView.tsx

import React from "react";
import { Node, Company, Protocol, Site, Subject } from "@/app/types";
import NodeCardGrid from "./NodeCardGrid";

import CompanyDetailHeader from "@/app/dashboard/components/View/CompanyDetailView";
import { ProtocolDetailHeader } from "@/app/dashboard/components/View/ProtocolDetailView";
import { SiteDetailHeader } from "@/app/dashboard/components/View/SiteDetailView";
import { SubjectDetail } from "@/app/dashboard/components/View/SubjectDetailView";

import { CompanyAnalytics } from "@/app/dashboard/components/analytics/company/CompanyAnalytics";
import { ProtocolAnalytics } from "@/app/dashboard/components/analytics/protocol/ProtocolAnalytics";
import { SiteAnalytics } from "@/app/dashboard/components/analytics/site/SiteAnalytics";

import { AdvancedCompanyAnalytics } from "@/app/dashboard/components/analytics/company/AdvancedCompanyAnalytics";
import { AdvancedProtocolAnalytics } from "@/app/dashboard/components/analytics/protocol/AdvancedProtocolAnalytics";
import { AdvancedSiteAnalytics } from "@/app/dashboard/components/analytics/site/AdvancedSiteAnalytics";

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

// a router to the correct detail view.
export default function NodeDetailView({ node }: { node: Node }) {
  // If the node is a subject, render its specific detail view
  if ("subjectId" in node) {
    return <SubjectDetail subject={node as Subject} />;
  }

  const children = getNodeChildren(node);
  const childrenTypeName = getChildrenTypeName(node);

  // Dynamically render the correct header and analytics based on the node type.
  const renderDetails = () => {
    if ("companyId" in node) {
      const company = node as Company;
      return (
        <>
          <CompanyDetailHeader company={company} />
          <CompanyAnalytics company={company} />
          <AdvancedCompanyAnalytics company={company} />
        </>
      );
    }
    if ("protocolId" in node) {
      const protocol = node as Protocol;
      return (
        <>
          <ProtocolDetailHeader protocol={protocol} />
          <ProtocolAnalytics protocol={protocol} />
          <AdvancedProtocolAnalytics protocol={protocol} />
        </>
      );
    }
    if ("siteId" in node) {
      const site = node as Site;
      return (
        <>
          <SiteDetailHeader site={site} />
          <SiteAnalytics site={site} />
          <AdvancedSiteAnalytics site={site} />
        </>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      {renderDetails()}

      <div className={styles.childrenSection}>
        <h3 className={styles.childrenTitle}>
          {childrenTypeName} ({children.length})
        </h3>
        <NodeCardGrid nodes={children} variant="detail" />
      </div>
    </div>
  );
}
