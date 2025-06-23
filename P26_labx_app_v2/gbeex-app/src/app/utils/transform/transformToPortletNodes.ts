// src/app/utils/transform/transformToPortletNodes.ts

import { PortletNode } from "@/app/types/common/portlet.types";

/**
 * Transforms raw group + investigation data from the API
 * into a flat list of `PortletNode` entries for rendering and tabs.
 *
 * @param rawData - Raw API response (array of groups with investigations)
 * @returns PortletNode[] - flat array of both group and item nodes
 */
export function transformToPortletNodes(rawData: any[]): PortletNode[] {
    const result: PortletNode[] = [];

    rawData.forEach((group: any) => {
        const groupId = group.id;
        const groupName = group.name;
        const investigations = Array.isArray(group.investigations) ? group.investigations : [];

        // Group node
        result.push({
            id: groupId,
            name: groupName,
            type: "group",
            parentIds: [],
            childIds: investigations.map((inv) => inv.id),
            meta: {
                custom: { original: group },
            },
        });

        // Child investigation nodes
        investigations.forEach((inv: any) => {
            result.push({
                id: inv.id,
                name: inv.name,
                type: "item",
                parentIds: [groupId],
                portletType: inv.portletType ?? "default",
                meta: {
                    custom: { original: inv },
                },
            });
        });
    });

    return result;
}
