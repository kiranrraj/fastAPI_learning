// app/contexts/company/CompanyProvider.tsx

"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { CompanyContext, CompanyContextType, Tab } from "./CompanyContext";
import { Company, Node } from "@/app/types";

const getNodeId = (node: Node): string => {
  if ("companyId" in node) return node.companyId;
  if ("protocolId" in node) return node.protocolId;
  if ("siteId" in node) return node.siteId;
  return node.subjectId;
};

const getNodeName = (node: Node): string => {
  if ("companyName" in node) return node.companyName;
  if ("protocolName" in node) return node.protocolName;
  if ("siteName" in node) return node.siteName;
  return node.subjectId;
};

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const defaultTabs: Tab[] = [{ id: "overview", title: "Overview" }];

  const [tabs, setTabs] = useState<Tab[]>([...defaultTabs]);
  const [activeTabId, setActiveTabId] = useState<string>("overview");

  useEffect(() => {
    setIsLoading(true);
    fetch("http://127.0.0.1:8000/api/v1/dev/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Failed to load companies:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleNodeSelect = (node: Node) => {
    const nodeId = getNodeId(node);
    const alreadyOpen = tabs.some((tab) => tab.id === nodeId);

    if (!alreadyOpen) {
      const newTab: Tab = {
        id: nodeId,
        title: getNodeName(node),
        node: node,
      };
      setTabs((prev) => [...prev, newTab]);
    }
    setActiveTabId(nodeId);
  };

  const setActiveTab = (id: string) => {
    setActiveTabId(id);
  };

  const closeTab = (id: string) => {
    const closingTabIndex = tabs.findIndex((tab) => tab.id === id);
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
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
    tabs,
    activeTabId,
    handleNodeSelect,
    setActiveTab,
    closeTab,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};
