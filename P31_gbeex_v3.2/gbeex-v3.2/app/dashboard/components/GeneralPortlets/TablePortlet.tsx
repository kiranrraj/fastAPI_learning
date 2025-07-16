"use client";

import React, { useContext, useState, useMemo } from "react";
import {
  CompanyContext,
  CompanyContextType,
} from "@/app/contexts/company/CompanyContext";
import { Subject } from "@/app/types";
import { ArrowUp, ArrowDown } from "lucide-react";
import styles from "./TablePortlet.module.css";
import { Node } from "@/app/types";

// New "enriched" type that includes parent info
type EnrichedSubject = Subject & {
  protocolName: string;
  siteName: string;
};

type SortConfig = {
  key: keyof EnrichedSubject | keyof Subject["demographics"];
  direction: "ascending" | "descending";
};

export default function TablePortlet() {
  const { activeTabId, openTabs } = useContext(
    CompanyContext
  ) as CompanyContextType;

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeTab = openTabs.find((tab) => tab.id === activeTabId);

  // This hook now enriches, filters, and sorts the data
  const processedSubjects = useMemo(() => {
    const node = activeTab?.data;
    if (!node) return [];

    // Step 1: Enrich the data by flattening the hierarchy and adding parent names
    let enrichedSubjects: EnrichedSubject[] = [];
    if ("companyId" in node) {
      enrichedSubjects = node.protocols.flatMap((protocol) =>
        protocol.sites.flatMap((site) =>
          site.subjects.map((subject) => ({
            ...subject,
            protocolName: protocol.protocolName,
            siteName: site.siteName,
          }))
        )
      );
    } else if ("protocolId" in node) {
      enrichedSubjects = node.sites.flatMap((site) =>
        site.subjects.map((subject) => ({
          ...subject,
          protocolName: node.protocolName,
          siteName: site.siteName,
        }))
      );
    } else if ("siteId" in node) {
      // We need to find the parent protocol name
      // This part assumes a flat list of subjects if the node is a site, and protocol name might be unavailable
      // A more robust solution would involve passing parent context down
      enrichedSubjects = node.subjects.map((subject) => ({
        ...subject,
        protocolName: "N/A", // Or look up if possible
        siteName: node.siteName,
      }));
    }

    // Step 2: Filter the data based on the search query
    const filteredSubjects =
      searchQuery.trim() === ""
        ? enrichedSubjects
        : enrichedSubjects.filter((subject) =>
            JSON.stringify(subject)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );

    // Step 3: Sort the filtered data
    let sortableItems = [...filteredSubjects];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === "age" || sortConfig.key === "sex") {
          aValue = a.demographics[sortConfig.key];
          bValue = b.demographics[sortConfig.key];
        } else {
          aValue = a[sortConfig.key as keyof EnrichedSubject];
          bValue = b[sortConfig.key as keyof EnrichedSubject];
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
  }, [activeTab?.data, searchQuery, sortConfig]);

  const requestSort = (
    key: keyof EnrichedSubject | keyof Subject["demographics"]
  ) => {
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

  const getSortIcon = (
    key: keyof EnrichedSubject | keyof Subject["demographics"]
  ) => {
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
      <div className={styles.header}>
        <h3 className={styles.portletTitle}>Subject Details</h3>
        <input
          type="text"
          placeholder="Search subjects..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => requestSort("subjectId")}>
                <span>Subject ID</span> {getSortIcon("subjectId")}
              </th>
              <th onClick={() => requestSort("protocolName")}>
                <span>Protocol</span> {getSortIcon("protocolName")}
              </th>
              <th onClick={() => requestSort("siteName")}>
                <span>Site</span> {getSortIcon("siteName")}
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
            {processedSubjects.map((subject) => (
              <tr key={subject.subjectId}>
                <td>{subject.subjectId}</td>
                <td>{subject.protocolName}</td>
                <td>{subject.siteName}</td>
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
            {processedSubjects.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.noResults}>
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
