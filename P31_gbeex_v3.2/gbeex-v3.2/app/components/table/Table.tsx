// components/table/Table.tsx
import React, { useState, useMemo, ChangeEvent } from "react";
import styles from "./Table.module.css";
import ControlBar from "@/app/components/table/ControlBar";
import TableHeader from "@/app/components/table/TableHeader";
import TableBody from "@/app/components/table/TableBody";
import TopButton from "@/app/components/table/TopButton";
import { Column } from "@/app/types/table.types";

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  height?: string;
}

export default function Table<T>({
  columns,
  data,
  height = "400px",
}: TableProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.map((c) => c.accessor))
  );

  const processedData = useMemo(() => {
    let filtered = data.filter((row) =>
      Array.from(visibleColumns).some((key) =>
        String(row[key]).toLowerCase().includes(searchText.toLowerCase())
      )
    );
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = String(a[sortConfig.key]),
          bVal = String(b[sortConfig.key]);
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }
    return filtered;
  }, [data, searchText, sortConfig, visibleColumns]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);
  const toggleColumn = (key: keyof T) => {
    const s = new Set(visibleColumns);
    s.has(key) ? s.delete(key) : s.add(key);
    setVisibleColumns(s);
  };
  const handleSort = (key: keyof T) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  return (
    <div className={styles.wrapper}>
      <ControlBar
        searchText={searchText}
        onSearch={handleSearch}
        columns={columns}
        visible={visibleColumns}
        onToggle={toggleColumn}
      />

      <div className={styles.tableContainer} style={{ maxHeight: height }}>
        <table className={styles.table}>
          <TableHeader
            columns={columns}
            visible={visibleColumns}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <TableBody
            data={processedData}
            columns={columns}
            visible={visibleColumns}
          />
        </table>
      </div>
    </div>
  );
}
