// src/app/components/layout/cards/PortletCardContent.tsx

import React from "react";
import styles from "./PortletCardContainer.module.css";

interface PortletCardContentProps {
  children: React.ReactNode;
}

/**
 * PortletCardContent
 * -------------------
 * This component renders the inner content of a portlet card.
 * It receives children and displays them within a styled wrapper.
 * Used inside PortletCardContainer.
 */
const PortletCardContent: React.FC<PortletCardContentProps> = ({
  children,
}) => {
  return <div className={styles.cardContentArea}>{children}</div>;
};

export default PortletCardContent;
