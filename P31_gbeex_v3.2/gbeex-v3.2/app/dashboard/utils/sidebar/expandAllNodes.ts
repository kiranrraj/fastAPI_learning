// utils/sidebar/expandAllNodes.ts

/**
 * Generates a Set containing all node IDs to expand all nodes in the tree.
 *
 * @param allNodeIds - An array of all node IDs in the tree.
 * @returns A Set of all node IDs, representing fully expanded nodes.
 */
export function expandAllNodes(allNodeIds: string[]): Set<string> {
    return new Set(allNodeIds);
}
