"use client";

import React, { useMemo, useState } from "react"; // Import useState
import { useDetailContext } from "@/app/contexts/detail/DetailContext";

// Correct imports for the company/protocol/site analytics components:
import { CompanyAnalytics } from "@/app/dashboard/components/analytics/company/CompanyAnalytics";
import { AdvancedCompanyAnalytics } from "@/app/dashboard/components/analytics/company/AdvancedCompanyAnalytics";
import { ProtocolAnalytics } from "@/app/dashboard/components/analytics/protocol/ProtocolAnalytics";
import { AdvancedProtocolAnalytics } from "@/app/dashboard/components/analytics/protocol/AdvancedProtocolAnalytics";
import { SiteAnalytics } from "@/app/dashboard/components/analytics/site/SiteAnalytics";
import { AdvancedSiteAnalytics } from "@/app/dashboard/components/analytics/site/AdvancedSiteAnalytics";

import styles from "./AnalyticsSection.module.css"; // Ensure this CSS file exists and is correctly styled
import { ChevronDown, ChevronUp } from "lucide-react";

interface AnalyticsSectionProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AnalyticsSection({
  collapsed,
  onToggle,
}: AnalyticsSectionProps) {
  const { nodeType, company, protocol, site } = useDetailContext();
  const [activeTab, setActiveTab] = useState("basicAnalytics"); // State to manage active tab

  const analyticsTabs = useMemo(() => {
    switch (nodeType) {
      case "company":
        return [
          {
            key: "basicAnalytics",
            label: "Basic Analytics",
            component: <CompanyAnalytics company={company!} />,
          },
          {
            key: "advancedAnalytics",
            label: "Advanced Analytics",
            component: <AdvancedCompanyAnalytics company={company!} />,
          },
        ];
      case "protocol":
        return [
          {
            key: "basicAnalytics",
            label: "Basic Analytics",
            component: <ProtocolAnalytics protocol={protocol!} />,
          },
          {
            key: "advancedAnalytics",
            label: "Advanced Analytics",
            component: <AdvancedProtocolAnalytics protocol={protocol!} />,
          },
        ];
      case "site":
        return [
          {
            key: "basicAnalytics",
            label: "Basic Analytics",
            component: <SiteAnalytics site={site!} />,
          },
          {
            key: "advancedAnalytics",
            label: "Advanced Analytics",
            component: <AdvancedSiteAnalytics site={site!} />,
          },
        ];
      default:
        return [];
    }
  }, [nodeType, company, protocol, site]);

  // Reset activeTab if the nodeType changes and the current tab key is no longer valid
  React.useEffect(() => {
    if (
      analyticsTabs.length > 0 &&
      !analyticsTabs.some((tab) => tab.key === activeTab)
    ) {
      setActiveTab(analyticsTabs[0].key);
    }
  }, [nodeType, analyticsTabs, activeTab]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Analytics</h2>
        <button onClick={onToggle} aria-label="Toggle analytics">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      <div
        className={`${styles.body} ${
          collapsed ? styles.collapsed : styles.expanded
        }`}
      >
        {!collapsed && (
          <>
            {analyticsTabs.length > 0 ? (
              <>
                <div className={styles.tabContainer}>
                  {analyticsTabs.map((tab) => (
                    <button
                      key={tab.key}
                      className={`${styles.tabButton} ${
                        activeTab === tab.key ? styles.activeTab : ""
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className={styles.tabContent}>
                  {
                    analyticsTabs.find((tab) => tab.key === activeTab)
                      ?.component
                  }
                </div>
              </>
            ) : (
              <div className={styles.noDataMessage}>
                No analytics data available for the selected view.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
