"use client";

import React, { useContext } from "react";
import {
  CompanyContext,
  CompanyContextType,
  Node,
} from "@/app/contexts/company/CompanyContext";
import NodeCardGrid from "@/app/dashboard/components/NodeCardGrid";
import SubjectCard from "@/app/dashboard/components/SubjectCard";
import styles from "./Content.module.css";
import { Loader, X } from "lucide-react";

const getNodeChildren = (node: Node): Node[] => {
  if ("protocols" in node) return node.protocols;
  if ("sites" in node) return node.sites;
  if ("subjects" in node) return node.subjects;
  return [];
};

const getNodeName = (node: Node): string => {
  if ("companyName" in node) return node.companyName;
  if ("protocolName" in node) return node.protocolName;
  if ("siteName" in node) return node.siteName;
  return node.subjectId;
};

const getNodeId = (node: Node): string => {
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

  const activeTab = openTabs.find((tab) => getNodeId(tab) === activeTabId);

  return (
    <div className={styles.contentWrapper}>
      {openTabs.length > 0 && (
        <div className={styles.tabBar}>
          {openTabs.map((tab) => (
            <button
              key={getNodeId(tab)}
              className={`${styles.tab} ${
                activeTabId === getNodeId(tab) ? styles.activeTab : ""
              }`}
              onClick={() => handleTabClick(getNodeId(tab))}
            >
              <span>{getNodeName(tab)}</span>
              <X
                size={16}
                className={styles.closeTabIcon}
                onClick={(e) => handleCloseTab(getNodeId(tab), e)}
              />
            </button>
          ))}
        </div>
      )}

      <div className={styles.contentArea}>
        {!activeTab ? (
          <>
            <h2 className={styles.pageTitle}>Companies Overview</h2>
            <p className={styles.subHeader}>
              Select a company from the sidebar or a card below.
            </p>
            <NodeCardGrid nodes={companies} />
          </>
        ) : "subjectId" in activeTab ? (
          <SubjectCard subject={activeTab} />
        ) : (
          <>
            <h2 className={styles.pageTitle}>{getNodeName(activeTab)}</h2>
            <NodeCardGrid nodes={getNodeChildren(activeTab)} />
          </>
        )}
      </div>
    </div>
  );
}
