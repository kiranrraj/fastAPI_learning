import React from "react";
import styles from "./PortletCardHeaderDetails.module.css";

interface PortletCardHeaderDetailsProps {
  title: string;
  portletType: string;
  tagColor?: string;
  status?: "idle" | "loading" | "error" | "success" | "stale";
}

const PortletCardHeaderDetails: React.FC<PortletCardHeaderDetailsProps> = ({
  title,
  portletType,
  tagColor,
  status,
}) => {
  return (
    <div className={styles.cardMetaRow}>
      <h1
        className={styles.cardTitle}
        style={{
          borderBottom: tagColor ? `3px solid ${tagColor}` : undefined,
        }}
      >
        {title}
      </h1>

      <span className={styles.cardType}>{portletType}</span>
    </div>
  );
};

export default PortletCardHeaderDetails;
