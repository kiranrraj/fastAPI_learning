// src/app/components/layout/content/ContentArea.tsx

import React from "react";
import styles from "@/app/components/styles/ContentArea.module.css";

interface ContentAreaProps {
  className?: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ className = "" }) => {
  return (
    <div
      className={`flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 ${styles.contentArea} ${className}`}
      role="main"
      aria-label="Main content"
    >
      <p className="text-lg font-semibold">Content area is empty</p>
    </div>
  );
};

export default React.memo(ContentArea);
