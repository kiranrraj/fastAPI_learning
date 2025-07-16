import React, { useState, useEffect, ReactNode } from "react";
import { CompanyContext, CompanyContextType, Tab } from "./CompanyContext";
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

  const defaultTabs: Tab[] = [
    { type: "view", id: "__overview__", label: "Overview" },
    { type: "view", id: "__table_view__", label: "Subject Table" },
    { type: "view", id: "__heatmap_view__", label: "Heatmap View" },
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

  const handleNodeSelect = (node: Company | Protocol | Site | Subject) => {
    const nodeId = getNodeId(node);
    const alreadyOpen = openTabs.some(
      (tab) => tab.type === "node" && getNodeId(tab.data) === nodeId
    );

    if (!alreadyOpen) {
      setOpenTabs((prev) => [...prev, { type: "node", data: node }]);
    }
    setActiveTabId(nodeId);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const closingTabIndex = openTabs.findIndex((tab) =>
      tab.type === "view" ? tab.id === tabId : getNodeId(tab.data) === tabId
    );

    const newTabs = openTabs.filter((tab) =>
      tab.type === "view" ? tab.id !== tabId : getNodeId(tab.data) !== tabId
    );

    setOpenTabs(newTabs);

    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        const newActiveIndex = Math.max(0, closingTabIndex - 1);
        const newActiveTab = newTabs[newActiveIndex];
        const newId =
          newActiveTab.type === "view"
            ? newActiveTab.id
            : getNodeId(newActiveTab.data);
        setActiveTabId(newId);
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
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};
