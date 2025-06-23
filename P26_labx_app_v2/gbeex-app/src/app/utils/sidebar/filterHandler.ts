// src/app/utils/sidebar/handlers/filterHandler.ts

import { PortletNode } from "@/app/types/common/portlet.types";

export function filterPortletsByGroupMatchOnly(
    groups: PortletNode[],
    query: string
): PortletNode[] {
    const q = query.trim().toLowerCase();
    return groups.filter((g) => g.name?.toLowerCase().includes(q));
}

export function filterPortletsByChildMatchOnly(
    items: PortletNode[],
    query: string
): PortletNode[] {
    const q = query.trim().toLowerCase();
    return items.filter((i) => i.name?.toLowerCase().includes(q));
}
