"use client";

import React from "react";
import GroupContentView from "./views/GroupContentView";
import ItemContentView from "./views/ItemContentView";
import { PortletNode } from "@/app/types/common/portlet.types";
import styles from "./ContentTabArea.module.css";

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
    return <div className={styles.noTabSelected}>No tab selected</div>;
  }

  if (activeTab.type === "group") {
    return (
      <div className={styles.groupViewWrapper}>
        <GroupContentView groupNode={activeTab} allNodes={portletMap} />
      </div>
    );
  }

  if (activeTab.type === "item") {
    return (
      <div className={styles.itemViewWrapper}>
        <ItemContentView itemNode={activeTab} />
      </div>
    );
  }

  return null;
};

export default ContentTabArea;
