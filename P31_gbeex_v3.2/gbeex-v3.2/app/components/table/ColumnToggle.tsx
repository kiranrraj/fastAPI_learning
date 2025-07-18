// components/table/ColumnToggle.tsx
import React from "react";
import styles from "./ColumnToggle.module.css";
import { Column } from "@/app/types/table.types";
import { Columns } from "lucide-react";

interface Props<T> {
  columns: Column<T>[];
  visible: Set<keyof T>;
  onToggle: (key: keyof T) => void;
}

export default function ColumnToggle<T>({
  columns,
  visible,
  onToggle,
}: Props<T>) {
  return (
    <div className={styles.toggleWrap}>
      <button className={styles.toggleBtn}>
        <Columns size={16} />
      </button>
      <div className={styles.menu}>
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
    </div>
  );
}
