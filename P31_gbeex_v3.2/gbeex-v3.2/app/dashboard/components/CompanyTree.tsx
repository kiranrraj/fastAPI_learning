"use client";

import React, { useState, ReactNode } from "react";
import { Company } from "@/app/types/types"; // Assuming this type definition exists
import {
  ChevronRight,
  Building2,
  FlaskConical,
  MapPin,
  TestTube2,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import styles from "./CompanyTree.module.css"; // Import the CSS module

// --- Reusable TreeNode Component ---
const TreeNode = ({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: ReactNode;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Combine class names based on the 'isOpen' state
  const chevronClasses = `${styles.chevron} ${
    isOpen ? styles.chevronOpen : ""
  }`;
  const contentClasses = `${styles.nodeContent} ${
    isOpen ? styles.contentOpen : ""
  }`;

  return (
    <div className={styles.treeNode}>
      {/* Node Header */}
      <div onClick={() => setIsOpen(!isOpen)} className={styles.nodeHeader}>
        <ChevronRight className={chevronClasses} />
        <div className={styles.nodeTitle}>
          {icon}
          <span className={styles.nodeTitleText}>{title}</span>
        </div>
      </div>

      {/* Node Content (Animated) */}
      <div className={contentClasses}>
        <div className={styles.nodeContentInner}>{children}</div>
      </div>
    </div>
  );
};

// --- Subject List Item Component ---
const SubjectListItem = ({
  subject,
}: {
  subject: { subjectId: string; status: string };
}) => {
  const statusIcons: { [key: string]: ReactNode } = {
    Screened: (
      <CheckCircle
        className={`${styles.statusIcon} ${styles.statusScreened}`}
      />
    ),
    Failed: (
      <XCircle className={`${styles.statusIcon} ${styles.statusFailed}`} />
    ),
    Enrolled: (
      <Loader className={`${styles.statusIcon} ${styles.statusEnrolled}`} />
    ),
  };

  return (
    <li className={styles.subjectItem}>
      <TestTube2 className={styles.subjectIcon} />
      <span className={styles.subjectId}>{subject.subjectId}</span>
      <span className={styles.separator}>-</span>
      <div className={styles.subjectStatus}>
        {statusIcons[subject.status] || (
          <TestTube2 className={styles.statusIcon} />
        )}
        <span>{subject.status}</span>
      </div>
    </li>
  );
};

// --- Main CompanyTree Component ---
export function CompanyTree({ company }: { company: Company }) {
  return (
    <div className={styles.container}>
      <TreeNode
        title={company.companyName}
        icon={<Building2 className={`${styles.icon} ${styles.iconCompany}`} />}
        defaultOpen={true}
      >
        <div className={styles.nodeList}>
          {company.protocols.map((protocol) => (
            <TreeNode
              key={protocol.protocolId}
              title={
                <div className={styles.protocolTitle}>
                  <span>{protocol.protocolName}</span>
                  <span className={styles.phaseBadge}>
                    Phase {protocol.phase}
                  </span>
                </div>
              }
              icon={
                <FlaskConical
                  className={`${styles.icon} ${styles.iconProtocol}`}
                />
              }
            >
              <div className={styles.nodeList}>
                {protocol.sites.map((site) => (
                  <TreeNode
                    key={site.siteId}
                    title={
                      <div className={styles.siteTitle}>
                        <span>{site.siteName}</span>
                        <span className={styles.country}>{site.country}</span>
                      </div>
                    }
                    icon={
                      <MapPin className={`${styles.icon} ${styles.iconSite}`} />
                    }
                  >
                    <ul className={styles.subjectList}>
                      {site.subjects.map((subject) => (
                        <SubjectListItem
                          key={subject.subjectId}
                          subject={subject}
                        />
                      ))}
                    </ul>
                  </TreeNode>
                ))}
              </div>
            </TreeNode>
          ))}
        </div>
      </TreeNode>
    </div>
  );
}
