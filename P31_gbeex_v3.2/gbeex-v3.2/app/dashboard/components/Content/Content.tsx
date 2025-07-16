"use client";

import React, { useContext } from "react";
import {
  CompanyContext,
  CompanyContextType,
} from "@/app/contexts/company/CompanyContext";
import { Node } from "@/app/types";
import { X } from "lucide-react";

// Components for different tab types
import NodeCardGrid from "@/app/dashboard/components/NodeCardGrid";
import TablePortlet from "@/app/dashboard/components/GeneralPortlets/TablePortlet";
// import HeatmapPortlet from "../Portlets/HeatmapPortlet";
import Overview from "@/app/dashboard/components/Overview";

import styles from "./Content.module.css";

// Helper to get children from a node, needed for the 'node_detail' view
const getNodeChildren = (node: Node): Node[] => {
  if ("protocols" in node) return node.protocols;
  if ("sites" in node) return node.sites;
  if ("subjects" in node) return node.subjects;
  return [];
};

export default function Content() {
  const context = useContext(CompanyContext);

  // Early exit if context is not yet available
  if (!context) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const { openTabs, activeTabId, handleTabClick, handleCloseTab } = context;
  const activeTab = openTabs.find((tab) => tab.id === activeTabId);

  // This function determines which component to show based on the active tab's type
  const renderTabContent = () => {
    // Add a check to ensure activeTab is not undefined
    if (!activeTab) {
      return (
        <div className={styles.emptyState}>
          Please select an item from the sidebar.
        </div>
      );
    }

    switch (activeTab.type) {
      case "overview":
        return <Overview />;

      case "node_detail":
        // Add a check to ensure the data needed for this view exists
        if (activeTab.data) {
          const children = getNodeChildren(activeTab.data);
          return <NodeCardGrid nodes={children} />;
        }
        return <div className={styles.emptyState}>No data for this item.</div>;

      case "node_table":
        // This tab type will render the table of subjects
        return <TablePortlet />;

      default:
        return <div className={styles.emptyState}>Unsupported tab type.</div>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabBar}>
        {openTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTabId === tab.id ? styles.active : ""
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span>{tab.label}</span>
            {/* Do not allow closing the last tab or the main overview tab */}
            {openTabs.length > 1 && tab.type !== "overview" && (
              <X
                className={styles.closeIcon}
                size={16}
                onClick={(e) => handleCloseTab(tab.id, e)}
              />
            )}
          </button>
        ))}
      </div>
      <div className={styles.contentArea}>{renderTabContent()}</div>
    </div>
  );
}
