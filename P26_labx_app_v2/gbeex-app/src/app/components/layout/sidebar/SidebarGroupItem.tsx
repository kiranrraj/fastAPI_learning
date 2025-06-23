// src/app/components/sidebar/SidebarGroupItem.tsx

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import styles from "./SidebarGroupItem.module.css";
import IconChevronDown from "../../icons/IconChevronDown";
import IconChevronUp from "../../icons/IconChevronUp";

export interface SidebarGroupItemProps {
  group: PortletNode;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onGroupClick: () => void;
  highlightedName: React.ReactNode;
}

const SidebarGroupItem: React.FC<SidebarGroupItemProps> = ({
  isExpanded,
  onToggleExpand,
  onGroupClick,
  highlightedName,
}) => {
  return (
    <div className={styles.groupItem}>
      <button
        className={styles.chevron}
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand();
        }}
      >
        {isExpanded ? <IconChevronDown /> : <IconChevronUp />}
      </button>
      <button className={styles.groupName} onClick={onGroupClick}>
        {highlightedName}
      </button>
    </div>
  );
};

export default SidebarGroupItem;
