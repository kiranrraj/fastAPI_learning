"use client";

import React, {
  useEffect,
  useState,
  FormEvent,
  useCallback,
  useMemo,
} from "react";
import styles from "./GenericSearchPortlet.module.css";

interface ParamMeta {
  name: string;
  type: "string" | "number" | "enum" | "boolean";
  required?: boolean;
  options?: string[];
  default?: any;
  description?: string;
}

interface FieldMeta {
  name: string;
  label: string;
}

interface UiMeta {
  views: ("table" | "card" | "json")[];
  defaultView: "table" | "card" | "json";
  viewParam: string;
}

interface SearchMeta {
  parameters: ParamMeta[];
  response: { fields: FieldMeta[] };
  ui: UiMeta;
  pagination: {
    pageParam: string;
    perPageParam: string;
    defaultPerPage: number;
    maxPerPage: number;
  };
}

interface PageEnvelope<T> {
  items: T[];
  page: number;
  per_page: number;
  total: number;
}

interface GenericSearchPortletProps {
  entity: "company" | "protocol" | "site" | "subject";
  initialFilters?: Record<string, string>;
}

export default function App({
  entity,
  initialFilters = {},
}: GenericSearchPortletProps) {
  const [meta, setMeta] = useState<SearchMeta | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [data, setData] = useState<PageEnvelope<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchData = useCallback(
    async (page: number, currentFilters: Record<string, any>) => {
      if (!meta) return;

      setLoading(true);
      setError(null);
      setData(null);

      const perPage =
        currentFilters[meta.pagination.perPageParam] ??
        meta.pagination.defaultPerPage;
      const qs = new URLSearchParams();
      qs.set(meta.pagination.pageParam, String(page));
      qs.set(meta.pagination.perPageParam, String(perPage));

      Object.entries(currentFilters).forEach(([k, v]) => {
        if (v !== "" && v != null) {
          qs.set(k, String(v));
        }
      });

      const url = `${API_BASE}/v1/search/${entity}?${qs}`;

      console.log(`[Frontend Fetch] Fetching: ${url}`);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${errorText}`
          );
        }
        const env: PageEnvelope<any> = await res.json();
        setData(env);
        setCurrentPage(env.page);
        console.log(
          `[Frontend Fetch] Received data for page ${env.page}:`,
          env
        ); // Log received data
      } catch (err: any) {
        setError(`Search failed: ${err.message}`);
        console.error("[Frontend Fetch] Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [meta, entity, API_BASE]
  );

  useEffect(() => {
    setMeta(null);
    setData(null);
    setError(null);
    setCurrentPage(1);

    const url = `${API_BASE}/v1/search/${entity}/meta`;
    console.log(`[Frontend Meta] Fetching meta: ${url}`);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((m: SearchMeta) => {
        setMeta(m);
        console.log("[Frontend Meta] Received meta:", m);

        const initial: Record<string, any> = {};
        m.parameters.forEach((p) => {
          if (p.default !== undefined) initial[p.name] = p.default;
        });
        setFilters(initial);
      })
      .catch((err) => {
        setError(`Failed loading configuration: ${err.message}`);
        console.error("[Frontend Meta] Error:", err);
      });
  }, [entity, initialFilters, API_BASE]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(
      "[Frontend Submit] Search button clicked. Fetching page 1 with filters:",
      filters
    ); // search
    fetchData(1, filters);
  };

  const handleClear = () => {
    if (!meta) return;
    const clearedFilters: Record<string, any> = {};
    meta.parameters.forEach((p) => {
      if (p.default !== undefined) clearedFilters[p.name] = p.default;
      else clearedFilters[p.name] = "";
    });
    setFilters(clearedFilters);
    console.log(
      "[Frontend Clear] Clear button clicked. Fetching page 1 with cleared filters:",
      clearedFilters
    ); // clear
    fetchData(1, clearedFilters);
  };

  const handlePageChange = (newPage: number) => {
    if (!meta) return;
    const totalPages = Math.ceil(
      (data?.total || 0) / (data?.per_page || meta.pagination.defaultPerPage)
    );
    console.log(
      `[Frontend Pagination] Changing to page ${newPage}. Current totalPages: ${totalPages}`
    ); // pagination
    if (newPage >= 1 && newPage <= totalPages) {
      fetchData(newPage, filters);
    }
  };

  const totalPages = useMemo(() => {
    const calculatedPages = data ? Math.ceil(data.total / data.per_page) : 0;
    console.log(
      `[Frontend Render] totalPages calculated: ${calculatedPages} (from data.total: ${data?.total}, data.per_page: ${data?.per_page})`
    );
    return calculatedPages;
  }, [data]);

  console.log(
    `[Frontend Render] current entity: ${entity}, currentPage: ${currentPage}, totalPages: ${totalPages}, loading: ${loading}, data exists: ${!!data}, data items length: ${
      data?.items?.length
    }`
  );

  if (error) return <div className={styles.error}>{error}</div>;
  if (!meta)
    return <div className={styles.loading}>Loading configuration…</div>;

  return (
    <div className={styles.portletContainer}>
      <h2 className={styles.portletTitle}>{entity} Search</h2>

      <form onSubmit={onSubmit} className={styles.searchForm}>
        {meta.parameters.map((p) => {
          if (p.name === "q" && initialFilters.q !== undefined) {
            return null;
          }

          const val = filters[p.name] ?? "";

          if (p.name === "q") {
            return (
              <div key={p.name} className={styles.formFieldFull}>
                <label
                  htmlFor={`filter-${p.name}`}
                  className={styles.formLabel}
                >
                  Search Query
                </label>
                <input
                  id={`filter-${p.name}`}
                  type="text"
                  value={val}
                  placeholder={p.description || "Enter keywords..."}
                  onChange={(e) =>
                    setFilters({ ...filters, [p.name]: e.target.value })
                  }
                  className={styles.formInput}
                />
              </div>
            );
          }

          if (entity === "subject" && p.name === "status" && p.options) {
            return (
              <div key={p.name} className={styles.formField}>
                <span className={styles.formLabel}>Status</span>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      className={styles.radioInput}
                      name={`filter-${p.name}`}
                      value=""
                      checked={val === ""}
                      onChange={(e) =>
                        setFilters({ ...filters, [p.name]: e.target.value })
                      }
                    />
                    <span className={styles.radioText}>Any</span>
                  </label>
                  {p.options.map((opt) => (
                    <label key={opt} className={styles.radioLabel}>
                      <input
                        type="radio"
                        className={styles.radioInput}
                        name={`filter-${p.name}`}
                        value={opt}
                        checked={val === opt}
                        onChange={(e) =>
                          setFilters({ ...filters, [p.name]: e.target.value })
                        }
                      />
                      <span className={styles.radioText}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          if (p.type === "enum" && p.options) {
            return (
              <div key={p.name} className={styles.formField}>
                <label
                  htmlFor={`filter-${p.name}`}
                  className={styles.formLabel}
                >
                  {p.name.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <select
                  id={`filter-${p.name}`}
                  value={val}
                  onChange={(e) =>
                    setFilters({ ...filters, [p.name]: e.target.value })
                  }
                  className={styles.formSelect}
                >
                  <option value="">
                    — Select {p.name.replace(/([A-Z])/g, " $1").trim()} —
                  </option>
                  {p.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={p.name} className={styles.formField}>
              <label htmlFor={`filter-${p.name}`} className={styles.formLabel}>
                {p.name.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                id={`filter-${p.name}`}
                type="text"
                value={val}
                placeholder={p.description || `Enter ${p.name}...`}
                onChange={(e) =>
                  setFilters({ ...filters, [p.name]: e.target.value })
                }
                className={styles.formInput}
              />
            </div>
          );
        })}

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className={styles.clearBtn}
          >
            Clear
          </button>
          <button type="submit" disabled={loading} className={styles.searchBtn}>
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {data && (
        <div className={styles.resultsSection}>
          <div className={styles.summaryAndPagination}>
            <span className={styles.summaryText}>
              Page {data.page} of {totalPages} — {data.total} items
            </span>
            <div className={styles.paginationControls}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={loading || currentPage <= 1}
                className={styles.paginationBtn}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={loading || currentPage >= totalPages}
                className={styles.paginationBtn}
              >
                Next
              </button>
            </div>
          </div>

          {data.items.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.resultsTable}>
                <thead>
                  <tr>
                    {meta.response.fields.map((f) => (
                      <th key={f.name} className={styles.tableHeader}>
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, idx) => (
                    <tr key={idx} className={styles.tableRow}>
                      {meta.response.fields.map((f) => (
                        <td key={f.name} className={styles.tableCell}>
                          {String(
                            f.name.split(".").reduce((o, k) => o?.[k], item) ??
                              ""
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noResults}>
              No results found for the current filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
