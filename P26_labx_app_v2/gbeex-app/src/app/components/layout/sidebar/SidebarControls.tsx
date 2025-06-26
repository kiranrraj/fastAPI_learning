import React from "react";
import styles from "./SidebarControls.module.css";
import IconChevronUp from "@/app/components/icons/IconChevronUp";
import IconChevronDown from "@/app/components/icons/IconChevronDown";
import Image from "next/image";

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
  return (
    <div className={styles.controlsWrapper}>
      <button className={styles.controlButton} onClick={onToggleSortOrder}>
        {sortOrder === "asc" ? "AZ" : "ZA"}
      </button>
      <button className={styles.controlButton} onClick={onExpandAll}>
        <IconChevronDown />
      </button>
      <button className={styles.controlButton} onClick={onCollapseAll}>
        <IconChevronUp />
      </button>
      <button
        className={styles.controlButton}
        onClick={onRefresh}
        disabled={loading}
        aria-busy={loading}
        aria-label="Refresh portlet data"
      >
        {loading ? (
          <Image
            src="/icon/refresh.svg"
            alt="Loading..."
            width={40}
            height={40}
            priority
            className={styles.spin}
          />
        ) : (
          <Image
            src="/icon/refresh.svg"
            alt="Refresh Icon"
            width={40}
            height={40}
            priority
          />
        )}
      </button>
    </div>
  );
};

export default SidebarControls;
