// src/app/components/layout/ContentArea.tsx
import React from "react";
import styles from "@/app/components/styles/ContentArea.module.css";

interface ContentAreaProps {
  children?: React.ReactNode;
  className?: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex-1 p-4 overflow-auto ${styles.contentArea} ${className}`}
      role="main"
      aria-label="Main content"
    >
      {children}
    </div>
  );
};

export default React.memo(ContentArea);
