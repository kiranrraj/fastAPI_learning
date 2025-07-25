// app/components/common/DataTable.tsx
"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import styles from "./DataTable.module.css";
import type { ColumnDefinition, SortDirection } from "@/app/types/dataExplorer";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  onSortChange?: (columnKey: string, direction: SortDirection) => void;
  activeSortColumn?: string;
  sortDirection?: SortDirection;
  noDataMessage?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  onSortChange,
  activeSortColumn,
  sortDirection,
  noDataMessage = "No data available.",
}: React.PropsWithChildren<DataTableProps<T>>) => {
  const handleHeaderClick = (columnKey: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return;
    const newDirection: SortDirection =
      activeSortColumn === columnKey && sortDirection === "asc"
        ? "desc"
        : "asc";
    onSortChange(columnKey, newDirection);
  };

  const formatCell = (value: any) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : "N/A";
    }
    if (Array.isArray(value)) return value.map((v) => String(v)).join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getRawText = (item: T, key: string) => formatCell(item[key]);

  if (!data || data.length === 0) {
    return <div className={styles.noDataMessage}>{noDataMessage}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? styles.sortableHeader : undefined}
                onClick={
                  col.sortable
                    ? () => handleHeaderClick(col.key, col.sortable)
                    : undefined
                }
              >
                <span className={styles.columnLabel}>{col.label}</span>
                {col.sortable && (
                  <span className={styles.sortIcon}>
                    {activeSortColumn === col.key &&
                      sortDirection === "asc" && <ChevronUp size={14} />}
                    {activeSortColumn === col.key &&
                      sortDirection === "desc" && <ChevronDown size={14} />}
                    {activeSortColumn !== col.key && (
                      <ChevronUp size={14} style={{ opacity: 0.3 }} />
                    )}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => {
                const rawText = getRawText(item, col.key);
                const cellValue = col.render ? col.render(item) : rawText;
                return (
                  <td key={`${col.key}-${rowIndex}`}>
                    <div className={styles.cellContent} title={rawText}>
                      {cellValue}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
