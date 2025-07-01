import React, { useState } from "react";
import styles from "./SidebarControls.module.css";
import {
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  SortAsc,
  SortDesc,
} from "lucide-react";

interface SidebarControlsProps {
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const SidebarControls: React.FC<SidebarControlsProps> = ({
  sortOrder,
  onToggleSortOrder,
  onExpandAll,
  onCollapseAll,
  onRefresh,
  loading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpandCollapse = () => {
    if (isExpanded) {
      onCollapseAll();
    } else {
      onExpandAll();
    }
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={styles.controlsWrapper}>
      <button
        className={styles.controlButton}
        onClick={onToggleSortOrder}
        title="Toggle Sort Order"
      >
        {sortOrder === "asc" ? (
          <SortAsc strokeWidth={2} size={18} />
        ) : (
          <SortDesc strokeWidth={2} size={18} />
        )}
      </button>

      <button
        className={styles.controlButton}
        onClick={handleToggleExpandCollapse}
        title={isExpanded ? "Collapse All" : "Expand All"}
      >
        {isExpanded ? (
          <ChevronUp strokeWidth={2} size={18} />
        ) : (
          <ChevronDown strokeWidth={2} size={18} />
        )}
      </button>

      <button
        className={`${styles.controlButton} ${loading ? styles.loading : ""}`}
        onClick={onRefresh}
        disabled={loading}
        aria-busy={loading}
        aria-label="Refresh portlet data"
        title="Refresh"
      >
        <RefreshCcw
          className={loading ? styles.spin : ""}
          size={18}
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

export default SidebarControls;
