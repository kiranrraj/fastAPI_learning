// app/components/dashboard/ContentArea/ContentArea.tsx
"use client";

import React, { useContext, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { PortletContext } from "@/app/context/PortletContext";
import PortletRegistrationForm from "@/app/components/dashboard/Portlet/Registration/PortletRegistrationForm";
import HomeView from "@/app/components/dashboard/View/HomeView";
import styles from "./ContentArea.module.css";
import type { Tab } from "@/app/types/tab";
import type { Portlet } from "@/app/types/portlet";
import { getPortletComponent } from "@/app/components/PortletComponent/PortletComponents";

export function ContentArea() {
  const { openTabs, activeTabId, setActiveTabId, closeTab } =
    useContext(PortletContext);

  // Find the active Tab object
  const activeTab = openTabs.find((t) => t.id === activeTabId);

  // logs
  useEffect(() => {
    console.log("OpenTabs:", openTabs);
    console.log("ActiveTabId:", activeTabId);
    console.log("ActiveTab:", activeTab);
  }, [openTabs, activeTabId, activeTab]);

  // Renders the content for the currently active tab based on its type and portlet configuration.
  const renderTabContent = useCallback(() => {
    if (!activeTab) {
      // Default message if no tab is active
      return (
        <div className={styles.noTabSelected}>
          Please select a tab from the sidebar.
        </div>
      );
    }

    // Handle custom type tabs
    if (activeTab.type === "custom") {
      // You can use a switch statement here if you have many custom IDs
      if (activeTab.id === "dashboard-home") {
        // Assuming dashboard-home is the ID for HomeView
        return <HomeView />;
      } else if (activeTab.id === "register-portlet-form") {
        // Assuming this ID for registration form
        return <PortletRegistrationForm />;
      }
      // Fallback for any other custom content that might be passed directly as an element
      return activeTab.content;
    }
    // Handle portlet type tabs
    else if (activeTab.type === "portlet") {
      const portletData = activeTab.data;

      // Differentiate rendering based on portletData.renderMechanism
      if (portletData.renderMechanism === "iframe" && portletData.url) {
        // Render an iframe for external URLs
        return (
          <iframe
            src={portletData.url}
            className={styles.iframe}
            allowFullScreen
            title={portletData.title}
          ></iframe>
        );
      } else if (
        portletData.renderMechanism === "component" &&
        portletData.componentName
      ) {
        // Render a local React component. Get the component from the central registry using its name
        const DynamicComponent = getPortletComponent(portletData.componentName);
        // Render the component, passing the full portlet data as props
        return <DynamicComponent portletData={portletData} />;
      } else {
        // Fallback for unrecognized portlet configurations
        return (
          <div className={styles.errorContainer}>
            <h3 className={styles.errorTitle}>Invalid Portlet Configuration</h3>
            <p className={styles.errorMessage}>
              Unable to render portlet: Missing URL for iframe or Component Name
              for local component, or unknown render mechanism.
            </p>
            <pre className={styles.errorDetails}>
              {JSON.stringify(portletData, null, 2)}
            </pre>
          </div>
        );
      }
    }
    return null;
  }, [activeTab]); // Re-run renderTabContent when activeTab changes

  return (
    <div className={styles.contentArea}>
      {/* Tab bar */}
      <div className={styles.tabBar}>
        {openTabs.map((t: Tab) => {
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
              {/* 'dashboard-home' tab should not be closable. Add 'register-portlet-form' to be closable. */}
              {tabId !== "dashboard-home" && ( // Only show close button if not the home tab
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
        {/* Render content using the renderTabContent function */}
        {renderTabContent()}
      </div>
    </div>
  );
}
