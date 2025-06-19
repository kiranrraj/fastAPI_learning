// src/app/utils/sidebar/sidebarUtils.ts
import { Tab } from '../../types/tabTypes';

export function getInitialCollapsedMap(groups: any[]): Record<string, boolean> {
  return Object.fromEntries(groups.map(group => [group.group_id, false]));
}

export function filterGroupsWithSearch(groups: any[], search: string) {
  const lower = search.toLowerCase();

  return groups.filter(group => {
    const groupMatches = group.name.toLowerCase().includes(lower);
    const childMatches = group.investigations?.some((inv: any) =>
      inv.name.toLowerCase().includes(lower)
    );
    return groupMatches || childMatches;
  });
}

export function tabExists(openTabs: Tab[], id: string): boolean {
  return openTabs.some(tab => tab.id === id);
}
