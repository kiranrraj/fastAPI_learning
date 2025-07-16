import React, { useState, useEffect, ReactNode } from "react";
import { CompanyContext } from "./CompanyContext";
import { Company, Protocol, Site, Subject } from "@/app/types";

const getNodeId = (node: Company | Protocol | Site | Subject): string => {
  if ("companyId" in node) return node.companyId;
  if ("protocolId" in node) return node.protocolId;
  if ("siteId" in node) return node.siteId;
  return node.subjectId;
};

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for tab management
  const [openTabs, setOpenTabs] = useState<
    (Company | Protocol | Site | Subject)[]
  >([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    setIsLoading(true);
    fetch("http://127.0.0.1:8000/api/v1/dev/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Failed to load companies:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // --- TAB MANAGEMENT LOGIC ---

  const handleNodeSelect = (node: Company | Protocol | Site | Subject) => {
    const nodeId = getNodeId(node);

    const tabExists = openTabs.some((tab) => getNodeId(tab) === nodeId);

    if (!tabExists) {
      setOpenTabs((prevTabs) => [...prevTabs, node]);
    }
    setActiveTabId(nodeId);
  };

  const handleTabClick = (nodeId: string) => {
    setActiveTabId(nodeId);
  };

  const handleCloseTab = (nodeIdToClose: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const closingTabIndex = openTabs.findIndex(
      (tab) => getNodeId(tab) === nodeIdToClose
    );
    const newTabs = openTabs.filter((tab) => getNodeId(tab) !== nodeIdToClose);

    setOpenTabs(newTabs);

    if (activeTabId === nodeIdToClose) {
      if (newTabs.length > 0) {
        const newActiveIndex = Math.max(0, closingTabIndex - 1);
        setActiveTabId(getNodeId(newTabs[newActiveIndex]));
      } else {
        setActiveTabId(null);
      }
    }
  };

  const value = {
    companies,
    isLoading,
    openTabs,
    activeTabId,
    handleNodeSelect,
    handleTabClick,
    handleCloseTab,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};
