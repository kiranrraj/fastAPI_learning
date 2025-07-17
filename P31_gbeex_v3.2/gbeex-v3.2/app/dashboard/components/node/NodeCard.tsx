// app/dashboard/components/Cards/NodeCard.tsx

import React, { useContext } from "react";
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
  Map as MapIcon, // Renamed to avoid conflict
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
  value: string | number;
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

  // Renders the main content of the card based on the node type
  const renderCardContent = () => {
    if ("companyId" in node) {
      const company = node as Company;
      return (
        <>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <Building2 />
            </div>
            <span className={styles.nodeType}>Company</span>
          </div>
          <h3 className={styles.nodeName}>{company.companyName}</h3>

          {variant === "detail" && (
            <div className={styles.detailsContainer}>
              <div className={styles.detailsGrid}>
                <DetailItem
                  icon={<ShieldCheck size={16} />}
                  label="Type"
                  value={company.sponsorType}
                />
                <DetailItem
                  icon={<Globe size={16} />}
                  label="HQ"
                  value={company.headquarters}
                />
                <DetailItem
                  icon={<AlertTriangle size={16} />}
                  label="Risk"
                  value={company.riskLevel}
                />
                <DetailItem
                  icon={<CheckCircle size={16} />}
                  label="Compliance"
                  value={`${company.complianceScore}%`}
                />
              </div>
              <TagListItem
                icon={<MapIcon size={14} />}
                label="Active Regions"
                items={company.activeRegions || []}
              />
              <TagListItem
                icon={<Activity size={14} />}
                label="Therapeutic Areas"
                items={company.therapeuticAreasCovered || []}
              />
            </div>
          )}
          <div className={styles.cardFooter}>
            <FlaskConical size={14} />
            <span>{company.protocols?.length ?? 0} Protocols</span>
          </div>
        </>
      );
    }
    // Fallback for other node types to ensure they still render
    if ("protocolId" in node) {
      const protocol = node as Protocol;
      return (
        <>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <FlaskConical />
            </div>
            <span className={styles.nodeType}>Protocol</span>
          </div>
          <h3 className={styles.nodeName}>{protocol.protocolName}</h3>
          <div className={styles.cardFooter}>
            <MapPin size={14} />
            <span>{protocol.sites?.length ?? 0} Sites</span>
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
              <MapPin />
            </div>
            <span className={styles.nodeType}>Site</span>
          </div>
          <h3 className={styles.nodeName}>{site.siteName}</h3>
          <div className={styles.cardFooter}>
            <TestTube2 size={14} />
            <span>{site.subjects?.length ?? 0} Subjects</span>
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
              <TestTube2 />
            </div>
            <span className={styles.nodeType}>Subject</span>
          </div>
          <h3 className={styles.nodeName}>{subject.subjectId}</h3>
          <div className={styles.cardFooter}>
            <Activity size={14} />
            <span>Status: {subject.status}</span>
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
