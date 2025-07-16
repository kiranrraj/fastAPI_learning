// utils/sidebar/toggleNodeExpansion.ts

/**
 * Toggles the expansion state of a node in the sidebar tree.
 *
 * @param nodeId - The ID of the node to toggle.
 * @param current - The current Set of expanded node IDs.
 * @returns A new Set with the nodeId added (expanded) or removed (collapsed).
 */
export function toggleNodeExpansion(
    nodeId: string,
    current: Set<string>
): Set<string> {
    // Create a new Set to avoid mutating the original Set directly
    const updated = new Set(current);

    // If the node is already expanded, collapse it; otherwise, expand it
    updated.has(nodeId) ? updated.delete(nodeId) : updated.add(nodeId);

    return updated;
}
