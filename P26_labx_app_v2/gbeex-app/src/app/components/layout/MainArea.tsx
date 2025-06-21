// src/app/components/layout/MainArea.tsx
import React from "react";
import SidebarArea from "../layout/sidebar/SidebarArea";
import ContentArea from "./ContentArea";
import styles from "@/app/components/styles/MainArea.module.css";

interface MainAreaProps {
  children?: React.ReactNode;
  className?: string;
}

const MainArea: React.FC<MainAreaProps> = ({ children, className = "" }) => {
  return (
    <main
      className={`flex flex-1 ${styles.mainArea} ${className}`}
      role="region"
      aria-label="Main Area"
    >
      <SidebarArea />
      <ContentArea>{children}</ContentArea>
    </main>
  );
};

export default React.memo(MainArea);
