// utils/sidebar/toggleHidden.ts
export function toggleHidden(
    nodeId: string,
    current: Set<string>
): Set<string> {
    const updated = new Set(current);
    updated.has(nodeId) ? updated.delete(nodeId) : updated.add(nodeId);
    return updated;
}