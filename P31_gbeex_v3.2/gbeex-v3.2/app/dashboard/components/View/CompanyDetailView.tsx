// app/dashboard/components/DetailViews/CompanyDetailView.tsx

import React from "react";
import { Company } from "@/app/types";
import styles from "./CompanyDetailView.module.css";
import {
  Building2,
  ShieldCheck,
  Globe,
  AlertTriangle,
  CheckCircle,
  Map,
  Activity,
} from "lucide-react";

// A small, reusable component to render a single detail item
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
    <div className={styles.detailIcon}>{icon}</div>
    <div>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.detailValue}>{value}</div>
    </div>
  </div>
);

// A component for displaying lists of items like regions or therapeutic areas
const ListDetailItem = ({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
}) => (
  <div className={`${styles.detailItem} ${styles.listDetailItem}`}>
    <div className={styles.detailIcon}>{icon}</div>
    <div>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.tagContainer}>
        {items.map((item) => (
          <span key={item} className={styles.tag}>
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export const CompanyDetailHeader = ({ company }: { company: Company }) => (
  <div className={styles.detailHeader}>
    <div className={styles.headerTitle}>
      <Building2 size={32} />
      <h2>{company.companyName}</h2>
    </div>
    <div className={styles.headerGrid}>
      <DetailItem
        icon={<ShieldCheck />}
        label="Sponsor Type"
        value={company.sponsorType}
      />
      <DetailItem
        icon={<Globe />}
        label="Headquarters"
        value={company.headquarters}
      />
      <DetailItem
        icon={<AlertTriangle />}
        label="Risk Level"
        value={company.riskLevel}
      />
      <DetailItem
        icon={<CheckCircle />}
        label="Compliance Score"
        value={`${company.complianceScore}%`}
      />
    </div>
    <div className={styles.fullWidthSection}>
      <ListDetailItem
        icon={<Map />}
        label="Active Regions"
        items={company.activeRegions || []}
      />
    </div>
    <div className={styles.fullWidthSection}>
      <ListDetailItem
        icon={<Activity />}
        label="Therapeutic Areas"
        items={company.therapeuticAreasCovered || []}
      />
    </div>
  </div>
);
