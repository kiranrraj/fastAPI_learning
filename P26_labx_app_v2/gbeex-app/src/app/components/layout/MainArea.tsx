// src/app/components/layout/MainArea.tsx

// "use client";
import React from "react";
import SidebarArea from "../layout/sidebar/SidebarArea";
import ContentArea from "../layout/content/ContentArea";
import styles from "@/app/components/styles/MainArea.module.css";

interface MainAreaProps {
  className?: string;
}

const MainArea: React.FC<MainAreaProps> = ({ className = "" }) => (
  <main
    className={`flex flex-1 ${styles.mainArea} ${className}`}
    role="region"
    aria-label="Main Area"
  >
    <SidebarArea />
    <ContentArea />
  </main>
);

export default React.memo(MainArea);
