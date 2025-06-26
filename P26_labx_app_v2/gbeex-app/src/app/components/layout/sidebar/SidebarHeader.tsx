import React from "react";
import styles from "./SidebarHeader.module.css";
import SidebarSearch from "./SidebarSearch";
import SidebarControls from "./SidebarControls";

interface SidebarHeaderProps {
  query: string;
  setQuery: (value: string) => void;
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  query,
  setQuery,
  sortOrder,
  onToggleSortOrder,
  onExpandAll,
  onCollapseAll,
  onRefresh,
  loading,
}) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>Portlets</h2>
      <SidebarSearch query={query} setQuery={setQuery} />
      <SidebarControls
        sortOrder={sortOrder}
        onToggleSortOrder={onToggleSortOrder}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
        onRefresh={onRefresh}
        loading={loading}
      />
    </div>
  );
};

export default SidebarHeader;
