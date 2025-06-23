"use client";

/**
 * Component: SidebarArea
 * ----------------------
 * This component renders the sidebar navigation for the app.
 * It displays a list of portlet groups, each containing child portlets.
 *
 * INPUT PROPS:
 * - groupData: PortletGroup[] → Array of portlet groups to display
 * - onGroupClick: (group: PortletGroup) => void → handler for group click
 * - onItemClick: (portlet: any) => void → handler for individual portlet click
 *
 * OUTPUT:
 * - Triggers openGroupTab or openItemTab when items are clicked.
 */

import React, { FC, useState } from "react";
import { PortletGroup } from "@/app/types/sidebar.types";

// Define the props interface
interface SidebarAreaProps {
  groupData: PortletGroup[];
  onGroupClick: (group: PortletGroup) => void;
  onItemClick: (portlet: any) => void;
}

const SidebarArea: FC<SidebarAreaProps> = ({
  groupData,
  onGroupClick,
  onItemClick,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <aside className="w-64 bg-gray-100 border-r overflow-y-auto">
      {groupData.map((group) => (
        <div key={group.id} className="border-b">
          <div
            className="cursor-pointer px-4 py-2 font-semibold bg-gray-200 hover:bg-gray-300"
            onClick={() => {
              toggleGroup(group.id);
              onGroupClick(group);
            }}
          >
            {group.name}
          </div>

          {expandedGroups[group.id] && (
            <div className="pl-6 py-2">
              {group.children?.map((child: any) => (
                <div
                  key={child.id}
                  className="cursor-pointer py-1 text-sm hover:text-blue-600"
                  onClick={() => onItemClick(child)}
                >
                  {child.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default SidebarArea;
