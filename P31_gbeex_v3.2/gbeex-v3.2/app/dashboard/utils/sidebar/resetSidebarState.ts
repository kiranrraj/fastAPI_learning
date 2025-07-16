// utils/sidebar/resetSidebarState.ts
export function resetSidebarState() {
    return {
        searchQuery: "",
        expandedNodeIds: new Set<string>(),
        favoriteIds: new Set<string>(),
        hiddenIds: new Set<string>(),
    };
}