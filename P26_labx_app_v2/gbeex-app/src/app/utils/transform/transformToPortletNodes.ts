// src/app/utils/transformToPortletNodes.ts

import { PortletNode } from "@/app/types/common/portlet.types";

/**
 * Transforms raw API group + investigation data into a flat array of PortletNode[]
 * used by sidebar, default tab, and card layout rendering logic.
 */
export function transformToPortletNodes(rawData: any[]): PortletNode[] {
    const portletNodes: PortletNode[] = [];

    rawData.forEach((group) => {
        // Convert each investigation group into a 'group' PortletNode
        const groupNode: PortletNode = {
            id: group.id,
            name: group.name,
            type: "group",
            parentIds: group.parent_group_id ? [group.parent_group_id] : [],
            childIds: group.investigations?.map((inv: any) => inv.id) || [],
            tagColor: "#888",
            readonly: true,
            meta: {
                createdAt: new Date(group.created_at).getTime(),
                viewMode: "default",
            },
        };

        portletNodes.push(groupNode);

        // Convert each investigation into an 'item' PortletNode
        group.investigations?.forEach((inv: any) => {
            const itemNode: PortletNode = {
                id: inv.id,
                name: inv.name,
                type: "item",
                parentIds: [group.id],
                group_ids: [group.id], // normalized to array

                portletType: "table",
                readonly: true,
                meta: {
                    createdAt: new Date(inv.created_at).getTime(),
                    viewMode: "compact",
                    custom: {
                        foreignGroupId: group["T.id"], // backend FK reference
                    },
                },
            };

            portletNodes.push(itemNode);
        });
    });

    return portletNodes;
}
