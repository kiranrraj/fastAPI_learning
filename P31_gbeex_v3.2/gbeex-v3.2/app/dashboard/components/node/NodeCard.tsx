// app/dashboard/components/Cards/NodeCard.tsx

import React, { useContext, useState } from "react";
import { Node, Company, Protocol, Site, Subject } from "@/app/types";
import {
  CompanyContext,
  CompanyContextType,
} from "@/app/contexts/company/CompanyContext";
import {
  Building2,
  FlaskConical,
  MapPin,
  TestTube2,
  ShieldCheck,
  Globe,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import styles from "./NodeCard.module.css";

// Helper to render a single key-value detail item
const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | React.ReactNode;
}) => (
  <div className={styles.detailItem}>
    {icon}
    <div className={styles.detailText}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  </div>
);

// Helper to render a list of tags
const TagListItem = ({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
}) => (
  <div className={styles.tagListItem}>
    <div className={styles.tagHeader}>
      {icon}
      <span className={styles.detailLabel}>{label}</span>
    </div>
    <div className={styles.tagContainer}>
      {items.map((item) => (
        <span key={item} className={styles.tag}>
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default function NodeCard({
  node,
  variant = "detail",
}: {
  node: Node;
  variant?: "overview" | "detail";
}) {
  const { handleNodeSelect } = useContext(CompanyContext) as CompanyContextType;
  const [isCompact, setIsCompact] = useState(true);
  const updatedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderCardContent = () => {
    if ("companyId" in node) {
      const company = node as Company;

      const companyDetailItems = [
        <DetailItem
          key="sponsorType"
          icon={<ShieldCheck size={16} className={styles.detailIconColor} />}
          label="Sponsor Type"
          value={company.sponsorType}
        />,
        <DetailItem
          key="headquarters"
          icon={<Globe size={16} className={styles.detailIconColor} />}
          label="Country"
          value={company.headquarters}
        />,
        <DetailItem
          key="complianceScore"
          icon={<CheckCircle size={16} className={styles.detailIconColor} />}
          label="Compliance Score"
          value={
            <span
              className={
                company.complianceScore >= 90
                  ? styles.complianceExcellent
                  : company.complianceScore >= 70
                  ? styles.complianceGood
                  : company.complianceScore >= 50
                  ? styles.complianceAverage
                  : styles.compliancePoor
              }
            >{`${company.complianceScore}%`}</span>
          }
        />,
        <DetailItem
          key="riskLevel"
          icon={
            <AlertTriangle
              size={16}
              className={`${styles.detailIconColor} ${
                company.riskLevel === "High"
                  ? styles.riskHigh
                  : company.riskLevel === "Medium"
                  ? styles.riskMedium
                  : styles.riskLow
              }`}
            />
          }
          label="Risk Level"
          value={
            <span
              className={`${
                company.riskLevel === "High"
                  ? styles.riskHigh
                  : company.riskLevel === "Medium"
                  ? styles.riskMedium
                  : styles.riskLow
              }`}
            >
              {company.riskLevel}
            </span>
          }
        />,
        <DetailItem
          key="protocolsCount"
          icon={<FlaskConical size={16} className={styles.detailIconColor} />}
          label="Protocols"
          value={company.protocols?.length ?? 0}
        />,
        <TagListItem
          key="activeRegions"
          icon={<MapIcon size={16} className={styles.detailIconColor} />}
          label="Active Regions"
          items={company.activeRegions || []}
        />,
        <TagListItem
          key="therapeuticAreas"
          icon={<Activity size={16} className={styles.detailIconColor} />}
          label="Therapeutic Areas"
          items={company.therapeuticAreasCovered || []}
        />,
      ];

      return (
        <>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <Building2 size={24} />
            </div>
            <h3 className={styles.nodeName}>{company.companyName}</h3>
          </div>
          {/* Removed locationSubtitle as it's now covered by a DetailItem */}
          {/* <p className={styles.locationSubtitle}>Our Location: {company.headquarters}</p> */}

          {variant === "overview" && (
            <div className={styles.overviewDetails}>
              {isCompact ? companyDetailItems.slice(0, 4) : companyDetailItems}
              {companyDetailItems.length > 4 && (
                <button
                  className={styles.viewMoreButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCompact(!isCompact);
                  }}
                >
                  {isCompact ? (
                    <>
                      View More <ChevronDown size={16} />
                    </>
                  ) : (
                    <>
                      View Less <ChevronUp size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          <div className={`${styles.cardFooter} ${styles.companyFooter}`}>
            <div className={styles.updatedTime}>Updated: {updatedTime}</div>
          </div>
        </>
      );
    }
    if ("protocolId" in node) {
      const protocol = node as Protocol;
      return (
        <>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <FlaskConical size={24} />
            </div>
            <h3 className={styles.nodeName}>{protocol.protocolName}</h3>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.footerInfo}>
              <MapPin size={14} />
              <span>{protocol.sites?.length ?? 0} Sites</span>
            </div>
            <div className={styles.updatedTime}>Updated: {updatedTime}</div>
          </div>
        </>
      );
    }
    if ("siteId" in node) {
      const site = node as Site;
      return (
        <>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <MapPin size={24} />
            </div>
            <h3 className={styles.nodeName}>{site.siteName}</h3>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.footerInfo}>
              <TestTube2 size={14} />
              <span>{site.subjects?.length ?? 0} Subjects</span>
            </div>
            <div className={styles.updatedTime}>Updated: {updatedTime}</div>
          </div>
        </>
      );
    }
    if ("subjectId" in node) {
      const subject = node as Subject;
      return (
        <>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <TestTube2 size={24} />
            </div>
            <h3 className={styles.nodeName}>{subject.subjectId}</h3>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.footerInfo}>
              <Activity size={14} />
              <span>Status: {subject.status}</span>
            </div>
            <div className={styles.updatedTime}>Updated: {updatedTime}</div>
          </div>
        </>
      );
    }
    return <p>Unknown Node Type</p>;
  };

  return (
    <div className={styles.card} onClick={() => handleNodeSelect(node)}>
      {renderCardContent()}
    </div>
  );
}
