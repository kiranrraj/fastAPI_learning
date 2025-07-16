"use client";

import { createContext } from "react";
import { Company, Protocol, Site, Subject } from "@/app/types";

// Defines the shape of the data and actions for company context
export type CompanyContextType = {
  companies: Company[];
  selectedNode: Company | Protocol | Site | Subject | null;
  handleNodeSelect: (node: Company | Protocol | Site | Subject) => void;

  isLoading: boolean;
};

// Creates the context that components will use to get the data
export const CompanyContext = createContext<CompanyContextType | null>(null);
