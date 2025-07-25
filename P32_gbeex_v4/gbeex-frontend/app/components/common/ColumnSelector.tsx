// app/components/common/ColumnSelector.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Settings2 } from "lucide-react";
import styles from "./ColumnSelector.module.css";
import type { ColumnDefinition } from "@/app/types/dataExplorer";

interface ColumnSelectorProps<T> {
  availableColumns: ColumnDefinition<T>[]; // All possible columns for the current data type
  selectedColumnKeys: string[]; // Keys of currently selected/visible columns
  onColumnToggle: (columnKey: string) => void; // Callback when a column's visibility is toggled
  onSelectAll: () => void; // Callback to select all columns
  onClearAll: () => void; // Callback to clear all columns
}

/**
 * ColumnSelector component provides a dropdown interface to select which columns
 * are visible in a DataTable. It also includes "Select All" and "Clear All" options.
 */
const ColumnSelector = <T,>({
  availableColumns,
  selectedColumnKeys,
  onColumnToggle,
  onSelectAll,
  onClearAll,
}: React.PropsWithChildren<ColumnSelectorProps<T>>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.columnSelectorContainer}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggleButton}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Settings2 size={16} className={styles.settingsIcon} />
        Columns ({selectedColumnKeys.length}/{availableColumns.length})
      </button>

      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdownPanel}>
          <div className={styles.optionActions}>
            <button
              type="button"
              onClick={onSelectAll}
              className={styles.actionButton}
            >
              Select All
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className={styles.actionButton}
            >
              Clear All
            </button>
          </div>
          <div className={styles.columnOptions}>
            {availableColumns.map((col) => (
              <label key={col.key} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedColumnKeys.includes(col.key)}
                  onChange={() => onColumnToggle(col.key)}
                  className={styles.checkboxInput}
                />
                {col.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;
