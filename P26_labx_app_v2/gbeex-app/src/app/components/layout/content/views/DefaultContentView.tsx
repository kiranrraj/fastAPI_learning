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
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Default View</h2>
      {portletData.length === 0 ? (
        <p className={styles.emptyMessage}>No portlets available.</p>
      ) : (
        <PortletCardListView items={portletData} />
      )}
    </div>
  );
};

export default DefaultContentView;
