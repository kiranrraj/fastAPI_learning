"use client";

import React, { useContext } from "react";
import {
  CompanyContext,
  CompanyContextType,
  Tab,
} from "@/app/contexts/company/CompanyContext";
import NodeCardGrid from "@/app/dashboard/components/NodeCardGrid";
import SubjectCard from "@/app/dashboard/components/SubjectCard";
import TablePortlet from "@/app/dashboard/components/GeneralPortlets/TablePortlet";
import HeatmapPortlet from "@/app/dashboard/components/GeneralPortlets/HeatmapPortlet";
import styles from "./Content.module.css";
import { Loader, X } from "lucide-react";
import { Node } from "@/app/types";

const getNodeChildren = (tab: Tab): Node[] => {
  if (tab.type !== "node") return [];
  const node = tab.data;
  if ("protocols" in node) return node.protocols;
  if ("sites" in node) return node.sites;
  if ("subjects" in node) return node.subjects;
  return [];
};

const getNodeName = (tab: Tab): string => {
  if (tab.type === "view") return tab.label;
  const node = tab.data;
  if ("companyName" in node) return node.companyName;
  if ("protocolName" in node) return node.protocolName;
  if ("siteName" in node) return node.siteName;
  if ("subjectId" in node) return node.subjectId;
  return "Unknown";
};

const getTabId = (tab: Tab): string => {
  return tab.type === "view" ? tab.id : getNodeId(tab.data);
};

const getNodeId = (node: any): string => {
  if ("companyId" in node) return node.companyId;
  if ("protocolId" in node) return node.protocolId;
  if ("siteId" in node) return node.siteId;
  return node.subjectId;
};

export default function Content() {
  const {
    companies,
    isLoading,
    openTabs,
    activeTabId,
    handleTabClick,
    handleCloseTab,
  } = useContext(CompanyContext) as CompanyContextType;

  if (isLoading) {
    return (
      <div className={styles.messageWrapper}>
        <Loader className={styles.loader} />
        <h2>Loading Data...</h2>
      </div>
    );
  }

  const activeTab = openTabs.find((tab) => getTabId(tab) === activeTabId);

  return (
    <div className={styles.contentWrapper}>
      {openTabs.length > 0 && (
        <div className={styles.tabBar}>
          {openTabs.map((tab) => (
            <button
              key={getTabId(tab)}
              className={`${styles.tab} ${
                activeTabId === getTabId(tab) ? styles.activeTab : ""
              }`}
              onClick={() => handleTabClick(getTabId(tab))}
            >
              <span>{getNodeName(tab)}</span>
              <X
                size={16}
                className={styles.closeTabIcon}
                onClick={(e) => handleCloseTab(getTabId(tab), e)}
              />
            </button>
          ))}
        </div>
      )}

      <div className={styles.contentArea}>
        {!activeTab ? null : activeTab.type === "view" &&
          activeTab.id === "__overview__" ? (
          <>
            <h2 className={styles.pageTitle}>Companies Overview</h2>
            {companies.length === 0 ? (
              <p>Loading companies...</p>
            ) : (
              <NodeCardGrid nodes={companies} />
            )}
          </>
        ) : activeTab.type === "view" && activeTab.id === "__table_view__" ? (
          <TablePortlet />
        ) : activeTab.type === "view" && activeTab.id === "__heatmap_view__" ? (
          <HeatmapPortlet />
        ) : activeTab.type === "node" && "subjectId" in activeTab.data ? (
          <SubjectCard subject={activeTab.data} />
        ) : activeTab.type === "node" ? (
          <>
            <h2 className={styles.pageTitle}>{getNodeName(activeTab)}</h2>
            <NodeCardGrid nodes={getNodeChildren(activeTab)} />
          </>
        ) : null}
      </div>
    </div>
  );
}
