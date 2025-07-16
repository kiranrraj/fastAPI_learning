"use client";

import React, { useContext, useState, useMemo } from "react";
import {
  CompanyContext,
  CompanyContextType,
  Node,
} from "@/app/contexts/company/CompanyContext";
import { Subject } from "@/app/types";
import { ArrowUp, ArrowDown } from "lucide-react";
import styles from "./TablePortlet.module.css";

// Helper function to recursively extract all subjects from a given node
const getSubjectsFromNode = (node: Node | undefined): Subject[] => {
  if (!node) return [];
  if ("protocols" in node)
    return node.protocols.flatMap((p: any) =>
      p.sites.flatMap((s: any) => s.subjects)
    );
  if ("sites" in node) return node.sites.flatMap((s: any) => s.subjects);
  if ("subjects" in node) return node.subjects;
  return [];
};

type SortConfig = {
  key: keyof Subject | keyof Subject["demographics"];
  direction: "ascending" | "descending";
};

export default function TablePortlet() {
  const { activeTabId, openTabs } = useContext(
    CompanyContext
  ) as CompanyContextType;
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const activeTab = openTabs.find(
    (tab) =>
      ("companyId" in tab
        ? tab.companyId
        : "protocolId" in tab
        ? tab.protocolId
        : "siteId" in tab
        ? tab.siteId
        : tab.subjectId) === activeTabId
  );
  const subjects = getSubjectsFromNode(activeTab);

  const sortedSubjects = useMemo(() => {
    let sortableItems = [...subjects];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Handle nested demographic properties
        if (sortConfig.key === "age" || sortConfig.key === "sex") {
          aValue = a.demographics[sortConfig.key];
          bValue = b.demographics[sortConfig.key];
        } else {
          aValue = a[sortConfig.key as keyof Subject];
          bValue = b[sortConfig.key as keyof Subject];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [subjects, sortConfig]);

  const requestSort = (key: keyof Subject | keyof Subject["demographics"]) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Subject | keyof Subject["demographics"]) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} className={styles.sortIcon} />
    ) : (
      <ArrowDown size={14} className={styles.sortIcon} />
    );
  };

  return (
    <div className={styles.portlet}>
      <h3 className={styles.portletTitle}>Subject Details</h3>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => requestSort("subjectId")}>
                <span>Subject ID</span> {getSortIcon("subjectId")}
              </th>
              <th onClick={() => requestSort("status")}>
                <span>Status</span> {getSortIcon("status")}
              </th>
              <th onClick={() => requestSort("age")}>
                <span>Age</span> {getSortIcon("age")}
              </th>
              <th onClick={() => requestSort("sex")}>
                <span>Sex</span> {getSortIcon("sex")}
              </th>
              <th>
                <span>Treatment Arm</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSubjects.map((subject) => (
              <tr key={subject.subjectId}>
                <td>{subject.subjectId}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[subject.status.replace(/\s+/g, "")]
                    }`}
                  >
                    {subject.status}
                  </span>
                </td>
                <td>{subject.demographics.age}</td>
                <td>{subject.demographics.sex}</td>
                <td>{subject.clinical.treatmentArm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
