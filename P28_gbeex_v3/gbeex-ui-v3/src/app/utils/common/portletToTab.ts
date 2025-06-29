// src/app/utils/common/portletToTab.ts

import { PortletNode } from "@/app/types/common/portlet.types";
import { TabType } from "@/app/types/common/tab.types";

/**
 * Converts a PortletNode into a TabType object.
 * Useful when opening tabs from portlet sidebar items or favorites.
 *
 * @param portlet - A PortletNode
 * @returns TabType
 */
export function portletToTab(portlet: PortletNode): TabType {
  return {
    id: portlet.id,
    title: portlet.name,
    type: portlet.type === "default" ? "default" : "item",
    closable: portlet.type !== "default",
    pinned: portlet.favorited ?? false,
  };
}

/**
 * Converts a TabType back into a PortletNode.
 * Useful for syncing sidebar state or when reconstructing portlet view.
 *
 * @param tab - A TabType object
 * @returns PortletNode
 */
export function tabToPortlet(tab: TabType): PortletNode {
  return {
    id: tab.id,
    name: tab.title,
    type: tab.type === "default" ? "default" : "item",
    favorited: tab.pinned,
    hidden: false,
    locked: false,
    tags: [],
    group_ids: []
  };
}
