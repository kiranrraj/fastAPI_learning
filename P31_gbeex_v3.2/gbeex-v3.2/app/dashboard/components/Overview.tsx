// app/dashboard/components/Overview.tsx

"use client";

import React, { useContext, useState, useMemo } from "react";
import { CompanyContext } from "@/app/contexts/company/CompanyContext";
import NodeCardGrid from "@/app/dashboard/components/node/NodeCardGrid";
import styles from "./Overview.module.css";
import {
  Search,
  X,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
} from "lucide-react";

import {
  filterCompanies,
  sortCompanies,
} from "@/app/dashboard/utils/overview/companyProcessing";
import { Company } from "@/app/types";

type Node = Company;

interface CompanyContextType {
  companies: Company[];
  isLoading: boolean;
}

// Define sorting options
type SortField =
  | "companyName"
  | "riskLevel"
  | "complianceScore"
  | "sponsorType"
  | "headquarters";
type SortDirection = "asc" | "desc";

export default function Overview() {
  const context = useContext(CompanyContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("companyName"); // Default sort field
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  if (!context || context.isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading companies...</p>
      </div>
    );
  }

  const { companies } = context;

  // Memoize the filtered and sorted companies using the utility functions
  const processedCompanies = useMemo(() => {
    // Filter
    const filtered = filterCompanies(companies, searchQuery);
    // Sort
    const sorted = sortCompanies(filtered, sortField, sortDirection);

    return sorted;
  }, [companies, searchQuery, sortField, sortDirection]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Companies Overview</h1>
      <p className={styles.subtitle}>
        Select a company to view its protocols in a new tab.
      </p>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search companies"
          />
          {searchQuery && (
            <button
              className={styles.clearSearchButton}
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className={styles.sortControls}>
          <div className={styles.sortRadioGroup}>
            <label className={styles.sortLabel}>Sort By:</label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="sortCriteria"
                value="companyName"
                checked={sortField === "companyName"}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className={styles.radioButton}
              />
              Name
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="sortCriteria"
                value="headquarters"
                checked={sortField === "headquarters"}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className={styles.radioButton}
              />
              Country
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="sortCriteria"
                value="sponsorType"
                checked={sortField === "sponsorType"}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className={styles.radioButton}
              />
              Sponsor
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="sortCriteria"
                value="riskLevel"
                checked={sortField === "riskLevel"}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className={styles.radioButton}
              />
              Risk Level
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="sortCriteria"
                value="complianceScore"
                checked={sortField === "complianceScore"}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className={styles.radioButton}
              />
              Compliance Score
            </label>
          </div>
          <button
            className={styles.sortDirectionButton}
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
            aria-label={`Toggle sort direction: ${
              sortDirection === "asc" ? "Ascending" : "Descending"
            }`}
          >
            {sortDirection === "asc" ? (
              <ArrowUpWideNarrow size={20} />
            ) : (
              <ArrowDownWideNarrow size={20} />
            )}
          </button>
        </div>
      </div>

      {processedCompanies.length === 0 && searchQuery !== "" ? (
        <div className={styles.emptyMessage}>
          <p>No companies found matching your search.</p>
        </div>
      ) : processedCompanies.length === 0 && searchQuery === "" ? (
        <div className={styles.emptyMessage}>
          <p>No companies available.</p>
        </div>
      ) : (
        <NodeCardGrid nodes={processedCompanies} variant="overview" />
      )}
    </div>
  );
}
