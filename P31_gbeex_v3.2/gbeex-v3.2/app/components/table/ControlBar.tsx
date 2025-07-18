// components/table/ControlBar.tsx
import React, { ChangeEvent } from "react";
import styles from "./ControlBar.module.css";
import { Column } from "@/app/types/table.types";
import { Search } from "lucide-react";
import ColumnToggle from "./ColumnToggle";

interface ControlBarProps<T> {
  searchText: string;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  columns: Column<T>[];
  visible: Set<keyof T>;
  onToggle: (key: keyof T) => void;
}

export default function ControlBar<T>({
  searchText,
  onSearch,
  columns,
  visible,
  onToggle,
}: ControlBarProps<T>) {
  return (
    <div className={styles.controls}>
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.icon} />
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={onSearch}
          className={styles.search}
        />
      </div>

      {/* Always‑visible horizontal column bar */}
      <ColumnToggle columns={columns} visible={visible} onToggle={onToggle} />
    </div>
  );
}
