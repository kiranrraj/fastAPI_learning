"use client";

import React, { ReactNode, useState } from "react";
import { DetailContext, NodeType, DetailContextValue } from "./DetailContext";
import type { Company, Protocol, Site, Subject } from "@/app/types";

/**
 * Props for the DetailProvider.
 * - nodeType: which level we’re detailing
 * - one of company/protocol/site/subject: the data object
 * - childrenNodes: that node’s immediate children array
 * - children: the subtree to render inside this provider
 */
export interface DetailProviderProps {
  nodeType: NodeType;
  company?: Company;
  protocol?: Protocol;
  site?: Site;
  subject?: Subject;
  childrenNodes: Array<Company | Protocol | Site | Subject>;
  children: ReactNode;
}

/**
 * Wrap your detail pane (CompanyPane, ProtocolPane, etc.) in this provider.
 * It manages shared UI state (viewMode, collapse flags) and supplies the
 * current node + its children to all descendants via context.
 */
export function DetailProvider({
  nodeType,
  company,
  protocol,
  site,
  subject,
  childrenNodes,
  children,
}: DetailProviderProps) {
  // State for children layout
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // State for collapsible panels
  const [analyticsCollapsed, setAnalyticsCollapsed] = useState<boolean>(false);
  const [visualizationCollapsed, setVisualizationCollapsed] =
    useState<boolean>(true);

  // Assemble the context value
  const contextValue: DetailContextValue = {
    // Node data
    nodeType,
    company,
    protocol,
    site,
    subject,
    children: childrenNodes,

    // UI state + setters
    viewMode,
    setViewMode,
    analyticsCollapsed,
    setAnalyticsCollapsed,
    visualizationCollapsed,
    setVisualizationCollapsed,
  };

  return (
    <DetailContext.Provider value={contextValue}>
      {children}
    </DetailContext.Provider>
  );
}
