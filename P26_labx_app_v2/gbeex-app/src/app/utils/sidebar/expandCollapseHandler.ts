// src/app/utils/sidebar/handlers/expandCollapseHandler.ts

/**
 * Returns a new expanded state where all group IDs are set to true (expanded)
 */
export function expandAllGroups(groupIds: string[]): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    for (const id of groupIds) {
        result[id] = true;
    }
    return result;
}

/**
 * Returns a new expanded state where all group IDs are set to false (collapsed)
 */
export function collapseAllGroups(groupIds: string[]): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    for (const id of groupIds) {
        result[id] = false;
    }
    return result;
}
