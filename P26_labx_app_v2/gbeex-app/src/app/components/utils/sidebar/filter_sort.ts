import { SidebarGroup } from "@/app/types/sidebar.types";

export type SortOrder = "az" | "za";

/**
 * Filters and sorts sidebar groups and investigations.
 */
export function filterAndSortGroups(
    groups: SidebarGroup[],
    searchTerm: string,
    sortOrder: SortOrder = "az"
): SidebarGroup[] {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = groups
        .map(group => {
            const groupNameMatches = group.name.toLowerCase().includes(lowerSearch);

            const filteredInvestigations = group.investigations.filter(inv =>
                inv.name.toLowerCase().includes(lowerSearch)
            );

            if (groupNameMatches || filteredInvestigations.length > 0) {
                return {
                    ...group,
                    investigations: groupNameMatches ? group.investigations : filteredInvestigations,
                };
            }

            return null;
        })
        .filter((group): group is SidebarGroup => group !== null);

    const sorted = filtered.sort((a, b) =>
        sortOrder === "az"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
    );

    return sorted;
}
