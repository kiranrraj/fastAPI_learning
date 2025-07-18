"use client";

import React from "react";
import { useDetailContext } from "@/app/contexts/detail/DetailContext";

// Correct imports for the company/protocol/site analytics components:
import { CompanyAnalytics } from "@/app/dashboard/components/analytics/company/CompanyAnalytics";
import { AdvancedCompanyAnalytics } from "@/app/dashboard/components/analytics/company/AdvancedCompanyAnalytics";
import { ProtocolAnalytics } from "@/app/dashboard/components/analytics/protocol/ProtocolAnalytics";
import { AdvancedProtocolAnalytics } from "@/app/dashboard/components/analytics/protocol/AdvancedProtocolAnalytics";
import { SiteAnalytics } from "@/app/dashboard/components/analytics/site/SiteAnalytics";
import { AdvancedSiteAnalytics } from "@/app/dashboard/components/analytics/site/AdvancedSiteAnalytics";

import styles from "./AnalyticsSection.module.css";
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

  let analyticsContent: React.ReactNode;
  switch (nodeType) {
    case "company":
      analyticsContent = (
        <>
          <CompanyAnalytics company={company!} />
          <AdvancedCompanyAnalytics company={company!} />
        </>
      );
      break;
    case "protocol":
      analyticsContent = (
        <>
          <ProtocolAnalytics protocol={protocol!} />
          <AdvancedProtocolAnalytics protocol={protocol!} />
        </>
      );
      break;
    case "site":
      analyticsContent = (
        <>
          <SiteAnalytics site={site!} />
          <AdvancedSiteAnalytics site={site!} />
        </>
      );
      break;
    default:
      analyticsContent = null;
  }

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
        {analyticsContent}
      </div>
    </section>
  );
}
