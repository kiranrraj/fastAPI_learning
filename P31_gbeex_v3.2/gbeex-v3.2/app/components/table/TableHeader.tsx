// components/table/TableHeader.tsx
import React from "react";
import styles from "./TableHeader.module.css";
import { Column } from "@/app/types/table.types";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Props<T> {
  columns: Column<T>[];
  visible: Set<keyof T>;
  sortConfig: { key: keyof T; direction: "asc" | "desc" } | null;
  onSort: (key: keyof T) => void;
}

export default function TableHeader<T>({
  columns,
  visible,
  sortConfig,
  onSort,
}: Props<T>) {
  return (
    <thead>
      <tr>
        {columns.map(
          (col) =>
            visible.has(col.accessor) && (
              <th
                key={String(col.accessor)}
                onClick={() => onSort(col.accessor)}
                className={styles.headerCell}
              >
                {col.header}
                {sortConfig?.key === col.accessor &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp size={14} className={styles.indicator} />
                  ) : (
                    <ChevronDown size={14} className={styles.indicator} />
                  ))}
              </th>
            )
        )}
      </tr>
    </thead>
  );
}
