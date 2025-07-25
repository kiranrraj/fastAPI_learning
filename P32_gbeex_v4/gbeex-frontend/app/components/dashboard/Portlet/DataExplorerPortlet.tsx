// app/components/portlets/DataExplorerPortlet.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";

// Import common components
import Breadcrumbs from "@/app/components/common/Breadcrumbs";
import SearchAndFilterBar from "@/app/components/common/SearchAndFilterBar";
import ColumnSelector from "@/app/components/common/ColumnSelector";
import DataTable from "@/app/components/common/DataTable";
import PaginationControls from "@/app/components/common/PaginationControls";

// Import specific detail views or components
import SubjectDetailView from "@/app/components/dashboard/Portlet/View/SubjectDetailView";

// Import types for data and data explorer logic
import type {
  Company,
  Protocol,
  Site,
  CompanyListItem,
  ProtocolListItem,
  SiteDashboardItem,
} from "@/app/types/companies";
import type { Subject } from "@/app/types/subjects";
import type { Portlet } from "@/app/types/portlet";
import type {
  ViewLevel,
  BreadcrumbItem,
  ColumnDefinition,
  SortDirection,
} from "@/app/types/dataExplorer";

import styles from "./DataExplorerPortlet.module.css";

// Define props for the DataExplorerPortlet
interface DataExplorerPortletProps {
  portletData: Portlet;
}

/**
 * DataExplorerPortlet provides a generic hierarchical data exploration interface.
 * It allows users to drill down from Companies to Protocols, Sites, and Subjects,
 * with search, filtering, column selection, and sorting capabilities at each level.
 */
const DataExplorerPortlet: React.FC<DataExplorerPortletProps> = ({
  portletData,
}) => {
  const { data: session } = useSession();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- State Management ---
  const [initialSearchScope, setInitialSearchScope] =
    useState<ViewLevel>("companies");
  const [currentViewLevel, setCurrentViewLevel] =
    useState<ViewLevel>("companies");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<
    string | undefined
  >(undefined);
  const [selectedProtocolId, setSelectedProtocolId] = useState<
    string | undefined
  >(undefined);
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(
    undefined
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<
    string | undefined
  >(undefined);

  const [dataResults, setDataResults] = useState<any[]>([]);
  const [singleSubjectData, setSingleSubjectData] = useState<Subject | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<
    Record<string, string | number | undefined>
  >({});

  const [availableColumns, setAvailableColumns] = useState<
    ColumnDefinition<any>[]
  >([]);
  const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>([]);
  const [activeSortColumn, setActiveSortColumn] = useState<string | undefined>(
    undefined
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  // NEW: Manual trigger for fetchData
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // --- Data Fetching Logic ---

  const getApiUrl = useCallback(() => {
    let url = `${API_BASE_URL}/api/v1/`;
    let queryParams = new URLSearchParams();

    if (searchTerm) queryParams.append("search_term", searchTerm);
    for (const key in filters) {
      if (filters[key] !== undefined) {
        queryParams.append(key, String(filters[key]));
      }
    }
    queryParams.append("page", String(currentPage));
    queryParams.append("limit", String(itemsPerPage));

    switch (currentViewLevel) {
      case "companies":
        url += "companies";
        break;
      case "protocols":
        // If drilling down, use specific endpoint. Otherwise, global list.
        if (selectedCompanyId)
          url += `companies/${selectedCompanyId}/protocols`;
        else url += "protocols"; // Global protocols list (requires backend /api/v1/protocols)
        break;
      case "sites":
        // If drilling down, use specific endpoint. Otherwise, global list.
        if (selectedProtocolId) url += `protocols/${selectedProtocolId}/sites`;
        else url += "sites"; // Global sites list (requires backend /api/v1/sites)
        break;
      case "subjects":
        // If drilling down, use specific endpoint. Otherwise, global search.
        if (selectedSiteId) url += `sites/${selectedSiteId}/subjects`;
        else url += "subjects/search"; // Global subjects search
        break;
      case "subjectDetail":
        if (selectedSubjectId) url += `subjects/${selectedSubjectId}`;
        else {
          setError("Error: Subject not selected for details.");
          return null;
        }
        break;
      default:
        setError("Error: Unknown view level.");
        return null;
    }

    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;

    console.log(`[DataExplorer] Fetching URL: ${url}`);
    return url;
  }, [
    API_BASE_URL,
    currentViewLevel,
    selectedCompanyId,
    selectedProtocolId,
    selectedSiteId,
    selectedSubjectId,
    searchTerm,
    filters,
    currentPage,
    itemsPerPage,
  ]);

  const fetchData = useCallback(async () => {
    if (!session?.accessToken || !API_BASE_URL) {
      setError(
        "Authentication token missing or API URL not configured. Please log in."
      );
      setIsLoading(false);
      return;
    }

    const url = getApiUrl();
    if (!url) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSingleSubjectData(null);
    setDataResults([]); // Always clear old data immediately on fetch start

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const responseData = await response.json();

      if (currentViewLevel === "subjectDetail") {
        setSingleSubjectData(responseData as Subject);
        setTotalItems(1);
      } else {
        // Expect PaginatedResponse for list views
        setDataResults(responseData.items || []);
        setTotalItems(responseData.total_count || 0);
        // Adjust currentPage if total_count implies fewer pages
        if (
          responseData.total_count > 0 &&
          responseData.page > Math.ceil(responseData.total_count / itemsPerPage)
        ) {
          setCurrentPage(1); // This will trigger another fetchData through useEffect
        }
      }
    } catch (err: any) {
      setError(`Failed to load data: ${err.message}`);
      setDataResults([]);
      setSingleSubjectData(null);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    session,
    API_BASE_URL,
    getApiUrl,
    currentViewLevel,
    itemsPerPage,
    fetchTrigger,
  ]); // Added fetchTrigger

  // --- Column Definitions for Each Level (Matching List Item Types) ---
  // These definitions now strictly adhere to the properties available in ListItem types.
  const companyColumns: ColumnDefinition<CompanyListItem>[] = useMemo(
    () => [
      { key: "companyName", label: "Company Name", sortable: true },
      { key: "companyId", label: "ID", sortable: true },
    ],
    []
  );

  const protocolColumns: ColumnDefinition<ProtocolListItem>[] = useMemo(
    () => [
      { key: "protocolName", label: "Protocol Name", sortable: true },
      { key: "protocolId", label: "ID", sortable: true },
      // Properties like 'drugName', 'therapeuticArea', 'phase', etc. are from full Protocol model, not ListItem
      // If you need them here, your backend's /api/v1/protocols endpoint must project them into ProtocolListItem
      // Or you need to define a more detailed "ProtocolListFullItem" type.
    ],
    []
  );

  const siteColumns: ColumnDefinition<SiteDashboardItem>[] = useMemo(
    () => [
      { key: "siteName", label: "Site Name", sortable: true },
      { key: "country", label: "Country", sortable: true },
      { key: "siteId", label: "ID", sortable: true },
      {
        key: "sitePerformanceSummary.trialSuccessRate",
        label: "Trial Success Rate",
        sortable: true,
        render: (item) =>
          `${
            (item.sitePerformanceSummary?.trialSuccessRate * 100).toFixed(1) ||
            0
          }%`,
      },
      {
        key: "sitePerformanceSummary.totalSubjectsEnrolledCount",
        label: "Subjects Enrolled",
        sortable: true,
        render: (item) =>
          item.sitePerformanceSummary?.totalSubjectsEnrolledCount || 0,
      },
      // Properties like 'city', 'siteType', 'principalInvestigator.name' are from full Site model, not SiteDashboardItem
    ],
    []
  );

  const subjectColumns: ColumnDefinition<Subject>[] = useMemo(
    () => [
      { key: "screeningNumber", label: "Screening No.", sortable: true },
      { key: "medicalRecordNumber", label: "MRN", sortable: true },
      { key: "age", label: "Age", sortable: true },
      { key: "gender", label: "Gender", sortable: true },
      { key: "status", label: "Status", sortable: true },
      // Contextual fields from aggregation, should be present on Subject type
      { key: "companyName", label: "Company", sortable: false },
      { key: "protocolName", label: "Protocol", sortable: false },
      { key: "siteName", label: "Site", sortable: false },
    ],
    []
  );

  const currentColumns = useMemo(() => {
    switch (currentViewLevel) {
      case "companies":
        return companyColumns;
      case "protocols":
        return protocolColumns;
      case "sites":
        return siteColumns;
      case "subjects":
        return subjectColumns;
      default:
        return [];
    }
  }, [
    currentViewLevel,
    companyColumns,
    protocolColumns,
    siteColumns,
    subjectColumns,
  ]);

  // --- Effects for State Synchronization ---

  useEffect(() => {
    setAvailableColumns(currentColumns);
    setSelectedColumnKeys(currentColumns.map((col) => col.key));
    setActiveSortColumn(undefined);
    setSortDirection("asc");
    setSearchTerm("");
    setFilters({});
    setCurrentPage(1); // Always reset page to 1 when currentColumns/view level change
  }, [currentColumns]);

  // Main useEffect to trigger data fetching
  useEffect(() => {
    // Only fetch if authenticated and API URL is set, and a fetch is triggered manually
    if (session?.accessToken && API_BASE_URL) {
      fetchData();
    }
  }, [fetchData, session?.accessToken, API_BASE_URL, fetchTrigger]); // fetchTrigger is the new dependency

  // --- Handlers for Navigation and Data Interaction ---

  /**
   * Handles initial search scope change via radio buttons.
   * Resets the entire exploration state to start from the selected top level.
   */
  const handleInitialSearchScopeChange = useCallback((level: ViewLevel) => {
    if (level === "subjectDetail") return;

    setInitialSearchScope(level);
    setCurrentViewLevel(level); // Sync current view level with initial scope
    setBreadcrumbs([]); // Clear breadcrumbs to start fresh

    // Clear all selected drill-down IDs
    setSelectedCompanyId(undefined);
    setSelectedProtocolId(undefined);
    setSelectedSiteId(undefined);
    setSelectedSubjectId(undefined);

    setCurrentPage(1); // Reset page
    setSearchTerm(""); // Reset search term
    setFilters({}); // Reset filters
    setFetchTrigger((prev) => prev + 1); // Trigger a new fetch manually
  }, []);

  /**
   * Handles drill-down into a lower level of the hierarchy.
   */
  const handleDrillDown = useCallback(
    (item: any, level: ViewLevel) => {
      let newBreadcrumbs = [...breadcrumbs];

      // Add current level's breadcrumb if not already the root of current drill-down
      if (
        newBreadcrumbs.length === 0 ||
        newBreadcrumbs[newBreadcrumbs.length - 1].level !== currentViewLevel
      ) {
        newBreadcrumbs.push({
          label:
            currentViewLevel.charAt(0).toUpperCase() +
            currentViewLevel.slice(1),
          level: currentViewLevel,
        });
      }

      // Add specific item breadcrumb based on current view level's item properties
      switch (currentViewLevel) {
        case "companies":
          newBreadcrumbs.push({
            label: item.companyName,
            level: "companies",
            id: item.companyId,
          });
          setSelectedCompanyId(item.companyId);
          break;
        case "protocols":
          newBreadcrumbs.push({
            label: item.protocolName,
            level: "protocols",
            id: item.protocolId,
          });
          setSelectedProtocolId(item.protocolId);
          break;
        case "sites":
          newBreadcrumbs.push({
            label: item.siteName,
            level: "sites",
            id: item.siteId,
          });
          setSelectedSiteId(item.siteId);
          break;
        case "subjects":
          newBreadcrumbs.push({
            label: item.screeningNumber,
            level: "subjects",
            id: item.subjectId,
          });
          setSelectedSubjectId(item.subjectId);
          break;
        default:
          break; // Should not happen for drill-down from list views
      }

      setBreadcrumbs(newBreadcrumbs);
      setCurrentViewLevel(level);
      setCurrentPage(1); // Reset to first page on drill-down
      setSearchTerm(""); // Reset search term on drill-down
      setFilters({}); // Reset filters on drill-down
      setFetchTrigger((prev) => prev + 1); // Trigger a new fetch manually
    },
    [breadcrumbs, currentViewLevel]
  );

  /**
   * Handles navigating back up the hierarchy via breadcrumbs.
   */
  const handleBreadcrumbClick = useCallback(
    (level: ViewLevel, id?: string) => {
      const breadcrumbIndex = breadcrumbs.findIndex(
        (crumb) => crumb.level === level && crumb.id === id
      );

      let targetLevel: ViewLevel;
      let newBreadcrumbs: BreadcrumbItem[];

      if (breadcrumbIndex !== -1) {
        newBreadcrumbs = breadcrumbs.slice(0, breadcrumbIndex + 1);
        targetLevel = level;
      } else if (level === initialSearchScope) {
        // Clicked the root of the initial search scope
        newBreadcrumbs = [];
        targetLevel = initialSearchScope;
      } else {
        console.warn(
          `[DataExplorer] Unexpected breadcrumb click. Resetting to initial search scope: ${initialSearchScope}`
        );
        newBreadcrumbs = [];
        targetLevel = initialSearchScope;
      }

      // Reset selected IDs based on the target level
      if (targetLevel === "companies") {
        setSelectedCompanyId(undefined);
        setSelectedProtocolId(undefined);
        setSelectedSiteId(undefined);
        setSelectedSubjectId(undefined);
      } else if (targetLevel === "protocols") {
        const lastCompanyCrumb = newBreadcrumbs.find(
          (crumb) => crumb.level === "companies"
        );
        setSelectedCompanyId(lastCompanyCrumb?.id); // Retain parent company ID
        setSelectedProtocolId(undefined);
        setSelectedSiteId(undefined);
        setSelectedSubjectId(undefined);
      } else if (targetLevel === "sites") {
        const lastProtocolCrumb = newBreadcrumbs.find(
          (crumb) => crumb.level === "protocols"
        );
        setSelectedProtocolId(lastProtocolCrumb?.id); // Retain parent protocol ID
        setSelectedSiteId(undefined);
        setSelectedSubjectId(undefined);
      } else if (targetLevel === "subjects") {
        const lastSiteCrumb = newBreadcrumbs.find(
          (crumb) => crumb.level === "sites"
        );
        setSelectedSiteId(lastSiteCrumb?.id); // Retain parent site ID
        setSelectedSubjectId(undefined);
      }

      setBreadcrumbs(newBreadcrumbs);
      setCurrentViewLevel(targetLevel);
      setCurrentPage(1);
      setSearchTerm("");
      setFilters({});
      setFetchTrigger((prev) => prev + 1); // Trigger a new fetch manually
    },
    [breadcrumbs, initialSearchScope]
  );

  const handleSearchAndFilter = useCallback(
    (term: string, newFilters: Record<string, string | number | undefined>) => {
      setSearchTerm(term);
      setFilters(newFilters);
      setCurrentPage(1); // Always reset to first page on new search/filter
      setFetchTrigger((prev) => prev + 1); // Trigger a new fetch manually
    },
    []
  );

  const handleColumnToggle = useCallback((columnKey: string) => {
    setSelectedColumnKeys((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  }, []);

  const handleSelectAllColumns = useCallback(() => {
    setSelectedColumnKeys(availableColumns.map((col) => col.key));
  }, [availableColumns]);

  const handleClearAllColumns = useCallback(() => {
    setSelectedColumnKeys([]);
  }, []);

  const handleSortChange = useCallback(
    (columnKey: string, direction: SortDirection) => {
      setActiveSortColumn(columnKey);
      setSortDirection(direction);

      setDataResults((prevResults) => {
        const sorted = [...prevResults].sort((a, b) => {
          const getValue = (obj: any, key: string) => {
            return key.split(".").reduce((o, i) => (o ? o[i] : undefined), obj);
          };

          const aValue = getValue(a, columnKey);
          const bValue = getValue(b, columnKey);

          if (aValue === bValue) return 0;
          if (aValue === undefined || aValue === null)
            return direction === "asc" ? 1 : -1;
          if (bValue === undefined || bValue === null)
            return direction === "asc" ? -1 : 1;

          if (typeof aValue === "string" && typeof bValue === "string") {
            return direction === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          } else {
            return direction === "asc"
              ? aValue > bValue
                ? 1
                : -1
              : aValue < bValue
              ? 1
              : -1;
          }
        });
        return sorted;
      });
    },
    []
  );

  const handleBackFromSubjectDetail = useCallback(() => {
    setCurrentViewLevel("subjects");
    setSingleSubjectData(null);
    setSelectedSubjectId(undefined);
    setBreadcrumbs((prev) =>
      prev.filter((crumb) => crumb.level !== "subjectDetail")
    );
    setCurrentPage(1);
    setSearchTerm("");
    setFilters({});
    setFetchTrigger((prev) => prev + 1); // Trigger a new fetch manually
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setFetchTrigger((prev) => prev + 1); // Trigger a new fetch manually
  }, []);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentFilterOptions = useMemo(() => {
    if (currentViewLevel === "subjects") {
      return {
        minAge: true,
        maxAge: true,
        gender: true,
        status: [
          "Enrolled",
          "Screening",
          "Completed",
          "Withdrawn",
          "Follow-up",
          "Pre-screening",
          "Screen Failure",
          "Lost to Follow-up",
          "Terminated",
        ],
      };
    }
    return {};
  }, [currentViewLevel]);

  useEffect(() => {
    // Initialize currentViewLevel with initialSearchScope only on mount if breadcrumbs are empty
    if (breadcrumbs.length === 0) {
      setCurrentViewLevel(initialSearchScope);
    }
  }, [initialSearchScope, breadcrumbs.length]);

  return (
    <div className={styles.container}>
      <h2 className={styles.portletTitle}>
        {portletData.title || "Data Explorer"}
      </h2>
      <p className={styles.portletDescription}>
        {portletData.description ||
          "Explore hierarchical data: Companies, Protocols, Sites, and Subjects."}
      </p>

      {/* Initial Search Scope Selection */}
      <div className={styles.initialScopeSelector}>
        <label className={styles.scopeLabel}>Start Exploring From:</label>
        <div className={styles.radioGroup}>
          {["companies", "protocols", "sites", "subjects"].map((level) => (
            <label key={level} className={styles.radioLabel}>
              <input
                type="radio"
                name="initialSearchScope"
                value={level}
                checked={initialSearchScope === level}
                onChange={() =>
                  handleInitialSearchScopeChange(level as ViewLevel)
                }
                className={styles.radio}
              />
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Breadcrumbs for navigation */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} onCrumbClick={handleBreadcrumbClick} />
      )}

      {/* Render single subject detail if selected */}
      {currentViewLevel === "subjectDetail" && singleSubjectData ? (
        <SubjectDetailView
          subject={singleSubjectData}
          onBack={handleBackFromSubjectDetail}
        />
      ) : (
        <>
          {/* Search and Filter Bar (only for list views) */}
          <SearchAndFilterBar
            onSearch={handleSearchAndFilter}
            currentLevel={currentViewLevel}
            loading={isLoading}
            initialSearchTerm={searchTerm}
            initialFilters={filters}
            filterOptions={currentFilterOptions}
          />

          {/* Column Selector */}
          <div className={styles.columnSelectorWrapper}>
            <ColumnSelector
              availableColumns={availableColumns}
              selectedColumnKeys={selectedColumnKeys}
              onColumnToggle={handleColumnToggle}
              onSelectAll={handleSelectAllColumns}
              onClearAll={handleClearAllColumns}
            />
          </div>

          {/* Loading, Error, or DataTable */}
          {isLoading ? (
            <div className={styles.loadingMessage}>
              Loading {currentViewLevel}...
            </div>
          ) : error ? (
            <div className={styles.errorMessageDisplay}>Error: {error}</div>
          ) : (
            <>
              <DataTable
                data={dataResults}
                columns={availableColumns.filter((col) =>
                  selectedColumnKeys.includes(col.key)
                )}
                onRowClick={(item) => {
                  // Determine the next drill-down level based on the current level
                  if (currentViewLevel === "companies")
                    handleDrillDown(item, "protocols");
                  else if (currentViewLevel === "protocols")
                    handleDrillDown(item, "sites");
                  else if (currentViewLevel === "sites")
                    handleDrillDown(item, "subjects");
                  else if (currentViewLevel === "subjects")
                    handleDrillDown(item, "subjectDetail");
                }}
                onSortChange={handleSortChange}
                activeSortColumn={activeSortColumn}
                sortDirection={sortDirection}
                noDataMessage={`No ${currentViewLevel} found.`}
              />
              {/* Pagination Controls */}
              {totalItems > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalCount={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DataExplorerPortlet;
