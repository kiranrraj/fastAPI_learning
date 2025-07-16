import React, { useState, useEffect, ReactNode } from "react";
import { CompanyContext, CompanyContextType, Tab } from "./CompanyContext";
import { Company, Protocol, Site, Subject } from "@/app/types";

// Helper functions also used for tab creation
const getNodeId = (node: Company | Protocol | Site | Subject): string => {
  if ("companyId" in node) return node.companyId;
  if ("protocolId" in node) return node.protocolId;
  if ("siteId" in node) return node.siteId;
  return node.subjectId;
};

const getNodeName = (node: Company | Protocol | Site | Subject): string => {
  if ("companyName" in node) return node.companyName;
  if ("protocolName" in node) return node.protocolName;
  if ("siteName" in node) return node.siteName;
  return node.subjectId;
};

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const defaultTabs: Tab[] = [
    { id: "__overview__", label: "Overview", type: "overview" },
  ];

  const [openTabs, setOpenTabs] = useState<Tab[]>([...defaultTabs]);
  const [activeTabId, setActiveTabId] = useState<string>("__overview__");

  useEffect(() => {
    setIsLoading(true);
    fetch("http://127.0.0.1:8000/api/v1/dev/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Failed to load companies:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Updated to create a "node_detail" tab
  const handleNodeSelect = (node: Company | Protocol | Site | Subject) => {
    const nodeId = getNodeId(node);
    const alreadyOpen = openTabs.some((tab) => tab.id === nodeId);

    if (!alreadyOpen) {
      const newTab: Tab = {
        id: nodeId,
        label: getNodeName(node),
        type: "node_detail",
        data: node,
      };
      setOpenTabs((prev) => [...prev, newTab]);
    }
    setActiveTabId(nodeId);
  };

  // Updated to create a new "node_table" tab
  const handleShowNodeInTableView = (
    node: Company | Protocol | Site | Subject
  ) => {
    const nodeId = getNodeId(node);
    const tabId = `${nodeId}__table`; // Unique ID for the new table tab
    const alreadyOpen = openTabs.some((tab) => tab.id === tabId);

    if (!alreadyOpen) {
      const newTab: Tab = {
        id: tabId,
        label: `Table: ${getNodeName(node)}`,
        type: "node_table",
        data: node,
      };
      setOpenTabs((prev) => [...prev, newTab]);
    }
    setActiveTabId(tabId);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
  };

  // Updated to handle the new tab structure
  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const closingTabIndex = openTabs.findIndex((tab) => tab.id === tabId);
    const newTabs = openTabs.filter((tab) => tab.id !== tabId);
    setOpenTabs(newTabs);

    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        const newActiveIndex = Math.max(0, closingTabIndex - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      } else {
        setActiveTabId("");
      }
    }
  };

  const value: CompanyContextType = {
    companies,
    isLoading,
    openTabs,
    activeTabId,
    handleNodeSelect,
    handleTabClick,
    handleCloseTab,
    handleShowNodeInTableView,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};
