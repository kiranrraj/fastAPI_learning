"use client";

import React, { useState } from "react";
import { InvestigationGroup } from "@/app/types/sidebar.types";
import IconChevronDown from "@/app/components/icons/IconChevronDown";
import IconChevronUp from "@/app/components/icons/IconChevronUp";

interface SidebarDataGroupProps {
  group: InvestigationGroup;
  onGroupClick?: (group: InvestigationGroup) => void;
  onItemClick?: (item: any) => void;
}

const SidebarDataGroup: React.FC<SidebarDataGroupProps> = ({
  group,
  onGroupClick,
  onItemClick,
}) => {
  const [expanded, setExpanded] = useState(false); // collapsed by default

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onGroupClick?.(group)}
          className="text-md font-semibold text-gray-700 dark:text-gray-200 text-left"
        >
          {group.name}
        </button>

        <button
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? "Collapse group" : "Expand group"}
          className="ml-2"
        >
          {expanded ? (
            <IconChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          ) : (
            <IconChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          )}
        </button>
      </div>

      {expanded && (
        <ul className="ml-4 mt-1 space-y-1">
          {group.children?.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick?.(item)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:underline text-left"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(SidebarDataGroup);
