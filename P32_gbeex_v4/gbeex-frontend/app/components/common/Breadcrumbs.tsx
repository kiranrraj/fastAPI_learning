// app/components/common/Breadcrumbs.tsx
"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem, ViewLevel } from "@/app/types/dataExplorer";
import styles from "./Breadcrumbs.module.css";

interface BreadcrumbsProps {
  items: BreadcrumbItem[]; // Array of breadcrumb items to display
  onCrumbClick: (level: ViewLevel, id?: string) => void; // Callback when a breadcrumb is clicked
}

/**
 * Breadcrumbs component displays a hierarchical navigation trail.
 * Users can click on individual crumbs to navigate back up the data hierarchy.
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onCrumbClick }) => {
  return (
    <nav className={styles.breadcrumbsContainer} aria-label="breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <li
            key={`${item.level}-${item.id || item.label}-${index}`}
            className={styles.breadcrumbItem}
          >
            {index > 0 && ( // Add a separator for all but the first item
              <ChevronRight size={16} className={styles.separatorIcon} />
            )}
            {/* Render as a button if not the last item (clickable) */}
            {index < items.length - 1 ? (
              <button
                type="button"
                onClick={() => onCrumbClick(item.level, item.id)}
                className={styles.breadcrumbLink}
              >
                {item.label}
              </button>
            ) : (
              // Render as plain text if it's the current (last) item
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
