"use client";

import React, { useState, useEffect } from "react";
import { InvestigationGroup } from "@/app/types/investigation.types";
import { toggleSetValue } from "@/app/components/utils/sidebar/handler_toggle";

// Icons
import IconChevronDown from "@/app/components/icons/IconChevronDown";
import IconChevronRight from "@/app/components/icons/IconChevronRight";

import { SidebarGroup } from "@/app/types/sidebar.types";

interface SidebarListProps {
  groups: SidebarGroup[];
}

const SidebarList: React.FC<SidebarListProps> = ({ groups }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    setExpandedGroups(new Set(groups.map((g) => g.id))); // Expand all by default
  }, [groups]);

  const handleToggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => toggleSetValue(prev, groupId));
  };

  return (
    <div>
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.id);
        return (
          <div key={group.id} className="mb-2">
            <div className="flex items-center gap-1 px-2">
              <button
                onClick={() => handleToggleGroup(group.id)}
                className="p-1"
                aria-label={isExpanded ? "Collapse group" : "Expand group"}
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
              </button>
              <span className="font-medium">{group.name}</span>
            </div>

            {isExpanded && (
              <ul className="ml-6 mt-1 text-sm text-gray-600 dark:text-gray-300">
                {group.investigations.map((inv) => (
                  <li key={inv.id} className="py-0.5">
                    {inv.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(SidebarList);
