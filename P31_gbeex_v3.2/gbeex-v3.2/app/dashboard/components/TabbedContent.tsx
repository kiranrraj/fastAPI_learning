// app/dashboard/components/TabbedContent.tsx
"use client";

import React, { useContext, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { DetailProvider } from "@/app/contexts/detail/DetailProvider";
import DetailPane from "@/app/dashboard/components/detail/DetailPane";
import { CompanyDetailHeader } from "@/app/dashboard/components/View/CompanyDetailHeader";
import { ProtocolDetailHeader } from "@/app/dashboard/components/View/ProtocolDetailView";
import { SiteDetailHeader } from "@/app/dashboard/components/View/SiteDetailView";
import { SubjectDetail } from "@/app/dashboard/components/View/SubjectDetailView";
import Overview from "@/app/dashboard/components/Overview";
import { CompanyContext } from "@/app/contexts/company/CompanyContext";
import styles from "./TabbedContent.module.css";
import type { Node } from "@/app/types";

export default function TabbedContent() {
  const { tabs, activeTabId, setActiveTab, closeTab, isLoading } =
    useContext(CompanyContext)!;

  // Ref for the tab header container
  const tabHeaderRef = useRef<HTMLDivElement>(null);

  // Scroll window to top when switching content
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTabId]);

  // Whenever a new tab is added, scroll the tab bar to show the newest one
  useEffect(() => {
    const headerEl = tabHeaderRef.current;
    if (headerEl) {
      // scroll to far right
      headerEl.scrollTo({
        left: headerEl.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [tabs.length]);

  if (isLoading) {
    return (
      <div className={styles.spinnerOverlay}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const activeTab = tabs.find((t) => t.id === activeTabId)!;

  return (
    <div className={styles.container}>
      {/* Tab list */}
      <div className={styles.tabHeader} ref={tabHeaderRef}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${
              tab.id === activeTabId ? styles.active : ""
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

      {/* Content area */}
      <div className={styles.tabContent}>
        {activeTab.id === "overview" ? (
          <Overview />
        ) : (
          (() => {
            const node = activeTab.node as Node;
            if ("companyId" in node) {
              return (
                <DetailProvider
                  nodeType="company"
                  company={node}
                  childrenNodes={node.protocols}
                >
                  <DetailPane
                    detailHeader={<CompanyDetailHeader company={node} />}
                  />
                </DetailProvider>
              );
            }
            if ("protocolId" in node) {
              return (
                <DetailProvider
                  nodeType="protocol"
                  protocol={node}
                  childrenNodes={node.sites}
                >
                  <DetailPane
                    detailHeader={<ProtocolDetailHeader protocol={node} />}
                  />
                </DetailProvider>
              );
            }
            if ("siteId" in node) {
              return (
                <DetailProvider
                  nodeType="site"
                  site={node}
                  childrenNodes={node.subjects}
                >
                  <DetailPane detailHeader={<SiteDetailHeader site={node} />} />
                </DetailProvider>
              );
            }
            // subject is a leaf
            return (
              <DetailProvider
                nodeType="subject"
                subject={node}
                childrenNodes={[]}
              >
                <DetailPane detailHeader={<SubjectDetail subject={node} />} />
              </DetailProvider>
            );
          })()
        )}
      </div>
    </div>
  );
}
