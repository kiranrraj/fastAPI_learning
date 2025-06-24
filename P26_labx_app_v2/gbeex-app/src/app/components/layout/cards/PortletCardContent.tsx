// src/app/components/layout/cards/PortletCardContent.tsx

/**
 * PortletCardContent
 * Renders the inner content of a portlet card, receives children and displays
 * them within a styled wrapper, used inside PortletCardContainer.
 */

import React from "react";
import styles from "./PortletCardContent.module.css";

interface PortletCardContentProps {
  children: React.ReactNode;
}

const PortletCardContent: React.FC<PortletCardContentProps> = ({
  children,
}) => {
  return <div className={styles.cardContentArea}>{children}</div>;
};

export default PortletCardContent;
