// src/app/utils/sidebar/handlers/sortHandler.ts

import { PortletNode } from "@/app/types/common/portlet.types";

/**
 * Sorts portlets by name alphabetically.
 * Groups come first, then their children sorted alphabetically.
 */
export function sortPortlets(
    portlets: PortletNode[],
    order: "asc" | "desc" = "asc"
): PortletNode[] {
    const compare = (a: string, b: string) => {
        if (order === "asc") return a.localeCompare(b);
        else return b.localeCompare(a);
    };

    const groups = portlets.filter((p) => p.type === "group").sort((a, b) =>
        compare(a.name.toLowerCase(), b.name.toLowerCase())
    );

    const items = portlets.filter((p) => p.type === "item").sort((a, b) =>
        compare(a.name.toLowerCase(), b.name.toLowerCase())
    );

    const sorted: PortletNode[] = [];

    for (const group of groups) {
        sorted.push(group);
        const children = items.filter((item) =>
            item.parentIds.includes(group.id)
        );
        sorted.push(...children);
    }

    return sorted;
}
