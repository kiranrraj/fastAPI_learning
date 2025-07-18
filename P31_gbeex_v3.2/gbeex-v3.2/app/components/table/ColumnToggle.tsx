// components/table/ColumnToggle.tsx
import React from "react";
import styles from "./ColumnToggle.module.css";
import { Column } from "@/app/types//table.types";

interface ColumnToggleProps<T> {
  columns: Column<T>[];
  visible: Set<keyof T>;
  onToggle: (accessor: keyof T) => void;
}

export default function ColumnToggle<T>({
  columns,
  visible,
  onToggle,
}: ColumnToggleProps<T>) {
  return (
    <div className={styles.bar}>
      {columns.map((col) => (
        <label key={String(col.accessor)} className={styles.item}>
          <input
            type="checkbox"
            checked={visible.has(col.accessor)}
            onChange={() => onToggle(col.accessor)}
          />
          {col.header}
        </label>
      ))}
    </div>
  );
}
