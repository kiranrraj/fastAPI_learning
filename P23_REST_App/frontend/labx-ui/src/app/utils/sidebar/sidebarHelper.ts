// src/app/utils/sidebarHelpers.ts

import { Tab } from "../../types/tabTypes";

// Check if a tab already exists
export function tabExists(tabs: Tab[], id: string): boolean {
  return tabs.some((tab) => tab.id === id);
}

// Create collapsed map from group array
export function getCollapsedGroupMap(groups: any[]): { [key: string]: boolean } {
  const map: { [key: string]: boolean } = {};
  groups.forEach((group) => {
    map[group.group_id] = false;
  });
  return map;
}

// Filter groups and investigations by search term
export function filterGroupsWithChildren(groups: any[], term: string): any[] {
  const lower = term.toLowerCase();

  return groups
    .map((group) => {
      const matchingChildren = group.investigations?.filter((inv: any) =>
        inv.name.toLowerCase().includes(lower)
      ) || [];

      const groupMatches = group.name.toLowerCase().includes(lower);

      if (groupMatches || matchingChildren.length > 0) {
        return {
          ...group,
          investigations: groupMatches ? group.investigations : matchingChildren,
        };
      }

      return null;
    })
    .filter(Boolean);
}
