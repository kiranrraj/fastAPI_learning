// src/app/utils/sidebar/handlers/searchHandlers.ts

import { PortletNode } from "@/app/types/common/portlet.types";

/**
 * Filters and expands nodes based on search query.
 * - Filters nodes whose names match the search term.
 * - Auto-expands parent groups if children match.
 *
 * @param nodes Full list of PortletNodes (flat structure)
 * @param query Search query string
 * @returns An object with filtered nodes and expanded group IDs
 */
export function filterAndExpandNodes(
    nodes: PortletNode[],
    query: string
): {
    filteredNodes: PortletNode[];
    autoExpandedGroups: Record<string, boolean>;
} {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
        // No filtering needed
        return {
            filteredNodes: nodes,
            autoExpandedGroups: {},
        };
    }

    const matchedIds = new Set<string>();
    const autoExpandedGroups: Record<string, boolean> = {};

    nodes.forEach((node) => {
        const nameMatch = node.name.toLowerCase().includes(trimmedQuery);

        if (nameMatch) {
            matchedIds.add(node.id);
            if (node.type === "item") {
                node.parentIds.forEach((pid) => {
                    autoExpandedGroups[pid] = true;
                });
            }
        }
    });

    const filteredNodes = nodes.filter(
        (node) => matchedIds.has(node.id) || (node.type === "group" && autoExpandedGroups[node.id])
    );

    return {
        filteredNodes,
        autoExpandedGroups,
    };
}
