"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { CompanyContext, CompanyContextType } from "./CompanyContext";
import { Company, Protocol, Site } from "@/app/types";

// This component fetches and provides the company data
export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedNode, setSelectedNode] = useState<
    Company | Protocol | Site | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the company data when the provider is first loaded
  useEffect(() => {
    setIsLoading(true);
    // This URL should be replaced with your actual API endpoint if different
    fetch("http://127.0.0.1:8000/api/v1/dev/companies")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setCompanies(data);
        // Automatically select the first company by default
        if (data && data.length > 0) {
          setSelectedNode(data[0]);
        }
      })
      .catch((err) => console.error("Failed to load companies:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Function to update the selected node when a user clicks in the tree
  const handleNodeSelect = (node: Company | Protocol | Site) => {
    setSelectedNode(node);
  };

  // The value that will be available to consuming components
  const value: CompanyContextType = {
    companies,
    selectedNode,
    handleNodeSelect,
    isLoading,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};
