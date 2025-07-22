// app/components/dashboard/ContentArea/ContentArea.tsx
"use client";

import { useContext, useEffect } from "react";
import { X } from "lucide-react";
import { PortletContext } from "@/app/context/PortletContext";
import PortletRegistrationForm from "@/app/components/dashboard/Portlet/Registration/PortletRegistrationForm";
import HomeView from "@/app/components/dashboard/View/HomeView";
import PortletView from "@/app/components/dashboard/View/PortletView";
import styles from "./ContentArea.module.css";
import type { Tab } from "@/app/types/tab";
import type { Portlet } from "@/app/types/portlet"; // Portlet is still needed for PortletView props

export function ContentArea() {
  const { openTabs, activeTabId, setActiveTabId, closeTab } =
    useContext(PortletContext);

  // Find the active Tab object
  const activeTab = openTabs.find((t) => t.id === activeTabId);

  // Debug logs
  useEffect(() => {
    console.log("OpenTabs:", openTabs);
    console.log("ActiveTabId:", activeTabId);
    console.log("ActiveTab:", activeTab);
  }, [openTabs, activeTabId, activeTab]);

  return (
    <div className={styles.contentArea}>
      {/* Tab bar */}
      <div className={styles.tabBar}>
        {openTabs.map((t: Tab) => {
          // Explicitly type 't' as Tab for clarity
          // 'id' and 'title' are common properties on both members of the Tab discriminated union
          const tabId = t.id;
          const title = t.title;

          return (
            <div
              key={tabId}
              className={`${styles.tab} ${
                tabId === activeTabId ? styles.active : ""
              }`}
              onClick={() => setActiveTabId(tabId)}
            >
              {title}
              {tabId !== "dashboard-home" && ( // 'dashboard-home' tab should not be closable
                <button
                  className={styles.closeBtn}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent tab activation when clicking close button
                    closeTab(tabId);
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Content area */}
      <div className={styles.tabContent}>
        {activeTab ? (
          // Use type guards to narrow 'activeTab' type
          (() => {
            if (activeTab.type === "custom") {
              // activeTab is now narrowed to { type: "custom", id: string, title: string, content?: ReactNode }
              if (activeTab.id === "dashboard-home") {
                return <HomeView />; // Render HomeView for the dashboard-home tab
              }
              return activeTab.content; // Render the component passed in 'content' prop for other custom tabs
            } else {
              // activeTab is now narrowed to { type: "portlet", id: string, title: string, data: Portlet }
              return (
                <PortletView // Render PortletView for portlet tabs
                  title={activeTab.data.title}
                  settings={activeTab.data.settings}
                />
              );
            }
          })()
        ) : (
          <div className={styles.empty}>
            Select a tab or register a new portlet.
          </div>
        )}
      </div>
    </div>
  );
}
