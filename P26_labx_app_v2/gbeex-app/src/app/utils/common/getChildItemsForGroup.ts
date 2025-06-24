// src\app\utils\common\getChildItemsForGroup.ts


import { PortletNode } from "@/app/types/common/portlet.types";

/**
 * Returns all item-type children of a given group ID.
 */
export function getChildItemsForGroup(
    groupId: string,
    allNodes: Record<string, PortletNode>
): PortletNode[] {
    return Object.values(allNodes).filter(
        (node) =>
            node.type === "item" &&
            (node.group_ids?.includes(groupId) || node.parentIds?.includes(groupId))
    );
}
