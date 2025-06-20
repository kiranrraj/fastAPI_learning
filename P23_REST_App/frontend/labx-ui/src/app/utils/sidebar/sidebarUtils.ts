// src/app/utils/sidebar/sidebarUtils.ts

import { Tab } from '../../types/tabTypes';

export function getInitialCollapsedMap(groups: any[]): Record<string, boolean> {
  return Object.fromEntries(groups.map(group => [group.group_id, false]));
}

export function filterGroupsWithSearch(groups: any[], search: string) {
  const lower = search.toLowerCase();

  return groups
    .map(group => {
      const groupMatches = group.name.toLowerCase().includes(lower);

      const sortedAllInvestigations = [...(group.investigations || [])].sort(
        (a: any, b: any) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      );

      const filteredInvestigations = sortedAllInvestigations.filter((inv: any) =>
        inv.name.toLowerCase().includes(lower)
      );

      return {
        ...group,
        investigations: groupMatches
          ? sortedAllInvestigations
          : filteredInvestigations,
      };
    })
    .filter(
      group =>
        group.name.toLowerCase().includes(lower) ||
        group.investigations.length > 0
    );
}

export function tabExists(openTabs: Tab[], id: string): boolean {
  return openTabs.some(tab => tab.id === id);
}
