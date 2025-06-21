"use client";

import React from "react";
import { SortOrder } from "@/app/types/sidebar.types";
import IconSortAZ from "@/app/components/icons/IconSortAZ";
import IconSortZA from "@/app/components/icons/IconSortZA";
import IconCollapse from "@/app/components/icons/IconCollapse";
import IconExpand from "@/app/components/icons/IconExpand";

interface SidebarButtonGroupProps {
  states: {
    sort: SortOrder;
    expanded: boolean;
  };
  onToggle: (key: keyof SidebarButtonGroupProps["states"]) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

const SidebarButtonGroup: React.FC<SidebarButtonGroupProps> = ({
  states,
  onToggle,
  onExpandAll,
  onCollapseAll,
}) => {
  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => onToggle("sort" as const)}
        title="Sort"
        aria-label="Sort"
      >
        {states.sort === "az" ? <IconSortAZ /> : <IconSortZA />}
      </button>

      <button
        onClick={() => (states.expanded ? onCollapseAll() : onExpandAll())}
        title={states.expanded ? "Collapse All" : "Expand All"}
        aria-label="Expand/Collapse All"
      >
        {states.expanded ? <IconCollapse /> : <IconExpand />}
      </button>
    </div>
  );
};

export default React.memo(SidebarButtonGroup);
