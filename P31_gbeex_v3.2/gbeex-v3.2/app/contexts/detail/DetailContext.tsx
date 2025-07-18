"use client";

import { createContext, useContext } from "react";
import type { Company, Protocol, Site, Subject } from "@/app/types";

// The kinds of nodes our detail panes support.
export type NodeType = "company" | "protocol" | "site" | "subject";

// The shape of data & UI state exposed via context.
export interface DetailContextValue {
  //Node data
  nodeType: NodeType;
  // Defined when nodeType === "company"
  company?: Company;
  // Defined when nodeType === "protocol"
  protocol?: Protocol;
  // Defined when nodeType === "site"
  site?: Site;
  // Defined when nodeType === "subject"
  subject?: Subject;

  // The immediate children of the current node:
  // *company.protocols
  // *protocol.sites
  // *site.subjects
  children: Array<Company | Protocol | Site | Subject>;

  // UI state
  // Whether to render children as cards or a table
  viewMode: "card" | "table";
  // Switch between card and table layout
  setViewMode: (mode: "card" | "table") => void;

  // Is the Analytics panel collapsed?
  analyticsCollapsed: boolean;
  // Toggle the Analytics panel open/closed
  setAnalyticsCollapsed: (collapsed: boolean) => void;

  // Is the Visualization panel collapsed?
  visualizationCollapsed: boolean;
  // Toggle the Visualization panel open/closed
  setVisualizationCollapsed: (collapsed: boolean) => void;
}

// Create the context with an undefined default so consumers can detect missing provider usage.
export const DetailContext = createContext<DetailContextValue | undefined>(
  undefined
);

// Hook to read the DetailContext. Throws a clear error if no provider is found.

export function useDetailContext(): DetailContextValue {
  const ctx = useContext(DetailContext);
  if (!ctx) {
    throw new Error("useDetailContext must be used within a DetailProvider");
  }
  return ctx;
}
