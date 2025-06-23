// src/app/utils/sidebar/handlers/expandCollapseHandler.ts

/**
 * Toggle the expand state of all group IDs.
 *
 * @param currentExpandedGroups Current expand state map
 * @param allGroupIds List of all group IDs
 * @param expandAll Whether to expand (true) or collapse (false)
 */
export function updateAllGroupExpandState(
    currentExpandedGroups: Record<string, boolean>,
    allGroupIds: string[],
    expandAll: boolean
): Record<string, boolean> {
    const newState: Record<string, boolean> = { ...currentExpandedGroups };
    for (const id of allGroupIds) {
        newState[id] = expandAll;
    }
    return newState;
}
