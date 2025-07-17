// app/dashboard/components/TabbedContent.tsx

"use client";

import React, { useContext } from "react";
import {
  CompanyContext,
  CompanyContextType,
} from "@/app/contexts/company/CompanyContext";
import Overview from "./Overview";
import NodeDetailView from "@/app/dashboard/components/node/NodeDetailView";
import styles from "./TabbedContent.module.css";
import { X } from "lucide-react";

const Spinner = () => (
  <div className={styles.spinnerOverlay}>
    <div className={styles.spinner}></div>
  </div>
);

export default function TabbedContent() {
  const context = useContext(CompanyContext);

  if (!context || context.isLoading) {
    return <Spinner />;
  }

  const { tabs, activeTabId, setActiveTab, closeTab } = context;

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className={styles.container}>
      <div className={styles.tabHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${
              activeTabId === tab.id ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
            {tab.id !== "overview" && tabs.length > 1 && (
              <X
                size={16}
                className={styles.closeIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              />
            )}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {/* Render Overview for the overview tab */}
        {activeTab?.id === "overview" && <Overview />}

        {/* --- FIX: Use NodeDetailView for all other tabs --- */}
        {activeTab && activeTab.id !== "overview" && activeTab.node && (
          <NodeDetailView node={activeTab.node} />
        )}
      </div>
    </div>
  );
}
