"use client";

import { createContext } from "react";
import { Company, Protocol, Site, Subject } from "@/app/types";

export type ViewTab = {
  type: "view";
  id: "__overview__" | "__table_view__" | "__heatmap_view__";
  label: string;
};

export type NodeTab = {
  type: "node";
  data: Company | Protocol | Site | Subject;
};

export type Tab = ViewTab | NodeTab;

export type CompanyContextType = {
  companies: Company[];
  isLoading: boolean;
  openTabs: Tab[];
  activeTabId: string;

  handleNodeSelect: (node: Company | Protocol | Site | Subject) => void;
  handleTabClick: (tabId: string) => void;
  handleCloseTab: (tabId: string, e: React.MouseEvent) => void;
};

export const CompanyContext = createContext<CompanyContextType | null>(null);
