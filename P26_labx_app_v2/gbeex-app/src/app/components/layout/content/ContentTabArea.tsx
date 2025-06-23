// src/app/components/layout/content/ContentTabArea.tsx

"use client";

import React from "react";
import GroupContentView from "./views/GroupContentView";
import ItemContentView from "./views/ItemContentView";
import { PortletNode } from "@/app/types/common/portlet.types";

interface ContentTabAreaProps {
  activeTab: PortletNode | undefined;
  portletMap: Record<string, PortletNode>;
}

/**
 * ContentTabArea
 * ---------------
 * Handles rendering of the active tab's content:
 * - Group view
 * - Item view
 * - Empty fallback
 */
const ContentTabArea: React.FC<ContentTabAreaProps> = ({
  activeTab,
  portletMap,
}) => {
  if (!activeTab) {
    return <div className="p-4 text-gray-600">No tab selected</div>;
  }

  if (activeTab.type === "group") {
    return <GroupContentView groupNode={activeTab} allNodes={portletMap} />;
  }

  if (activeTab.type === "item") {
    return <ItemContentView itemNode={activeTab} />;
  }

  return null;
};

export default ContentTabArea;
