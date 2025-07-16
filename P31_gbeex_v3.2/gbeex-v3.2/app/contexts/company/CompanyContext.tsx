"use client";

import { createContext } from "react";
import { Company, Protocol, Site, Subject } from "@/app/types";

export type Node = Company | Protocol | Site | Subject;

export type CompanyContextType = {
  // State
  companies: Company[];
  isLoading: boolean;
  openTabs: Node[];
  activeTabId: string | null;

  // Actions
  handleNodeSelect: (node: Node) => void;
  handleTabClick: (nodeId: string) => void;
  handleCloseTab: (nodeIdToClose: string, e: React.MouseEvent) => void;
};

export const CompanyContext = createContext<CompanyContextType | null>(null);
