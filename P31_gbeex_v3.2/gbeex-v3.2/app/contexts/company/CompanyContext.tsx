// app/contexts/company/CompanyContext.tsx

"use client";

import { createContext } from "react";
import { Company, Node } from "@/app/types";

export interface Tab {
  id: string;
  title: string; // The property is named 'title'
  node?: Node;
}

export type CompanyContextType = {
  companies: Company[];
  isLoading: boolean;
  tabs: Tab[];
  activeTabId: string;
  handleNodeSelect: (node: Node) => void;
  setActiveTab: (id: string) => void;
  closeTab: (id: string) => void;
  // Open (or activate) a tab for the given node
  openTab: (node: Node) => void;
};

export const CompanyContext = createContext<CompanyContextType | undefined>(
  undefined
);
