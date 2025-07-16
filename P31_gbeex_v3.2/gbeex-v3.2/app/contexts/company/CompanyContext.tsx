"use client";

import { createContext } from "react";
import { Company, Protocol, Site, Subject } from "@/app/types";

// A more flexible and explicit Tab type
export type Tab = {
  id: string;
  label: string;
  type: "overview" | "node_detail" | "node_table";
  data?: Company | Protocol | Site | Subject;
};

export type CompanyContextType = {
  companies: Company[];
  isLoading: boolean;
  openTabs: Tab[];
  activeTabId: string;

  handleNodeSelect: (node: Company | Protocol | Site | Subject) => void;
  handleTabClick: (tabId: string) => void;
  handleCloseTab: (tabId: string, e: React.MouseEvent) => void;
  handleShowNodeInTableView: (
    node: Company | Protocol | Site | Subject
  ) => void;
};

export const CompanyContext = createContext<CompanyContextType | null>(null);
