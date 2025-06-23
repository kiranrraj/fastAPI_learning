// src/app/components/layout/content/shared/PortletCardListView.tsx

"use client";

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import styles from "./PortletCardListView.module.css";

interface PortletCardListViewProps {
  title?: string;
  items: PortletNode[];
}

const PortletCardListView: React.FC<PortletCardListViewProps> = ({
  title,
  items,
}) => {
  return (
    <div className={styles.cardGroup}>
      {title && <h2 className={styles.groupTitle}>{title}</h2>}

      <div className={styles.cardList}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <h3 className={styles.cardTitle}>{item.name}</h3>
            <p className={styles.cardMeta}>Type: {item.portletType}</p>
            {/* Add buttons, data previews, etc. here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortletCardListView;
