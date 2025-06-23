"use client";

import React from "react";
import CardContainer from "@/app/components/layout/card/CardContainer";
import { PortletGroup } from "@/app/types/sidebar.types";

/**
 * TabDefaultView Component
 *
 * This component renders the default view when no tab is open.
 * It uses the same group data as the sidebar and shows each parent group as a card,
 * with its children rendered inside the content area.
 *
 * Props:
 * - groups: Array of portlet groups (same as sidebar).
 * - onPortletClick: Handler when a child item (portlet) is clicked.
 *
 * Behavior:
 * - Displays each group as a titled card.
 * - Renders its children (investigations) inside the card.
 * - Clicking on a child invokes the passed `onPortletClick`.
 */
interface TabDefaultViewProps {
  groups: PortletGroup[];
  onPortletClick: (portletId: string) => void;
}

const TabDefaultView: React.FC<TabDefaultViewProps> = ({
  groups,
  onPortletClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {groups.map((group) => (
        <CardContainer
          key={group.id}
          title={group.name}
          onClose={() => {}}
          onShare={() => {}}
          onLink={() => {}}
        >
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
            {group.children.map((child) => (
              <li
                key={child.id}
                className="cursor-pointer hover:underline"
                onClick={() => onPortletClick(child.id)}
              >
                • {child.name}
              </li>
            ))}
          </ul>
        </CardContainer>
      ))}
    </div>
  );
};

export default React.memo(TabDefaultView);
