import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import PortletCardListView from "@/app/components/layout/content/views/PortletCardListView";
import styles from "./DefaultContentView.module.css";

interface DefaultContentViewProps {
  portletData: PortletNode[];
}

const DefaultContentView: React.FC<DefaultContentViewProps> = ({
  portletData,
}) => {
  // Filter only group type portlets for default view
  const groupPortlets = portletData.filter((node) => node.type === "group");

  return (
    <div className={styles.wrapper}>
      {groupPortlets.length === 0 ? (
        <p className={styles.emptyMessage}>No groups available.</p>
      ) : (
        <PortletCardListView items={groupPortlets} />
      )}
    </div>
  );
};

export default DefaultContentView;
