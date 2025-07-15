// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import styles from "@/app/dashboard/Dashboard.module.css";
import Header from "@/app/dashboard/components/Header";
import Footer from "@/app/dashboard/components/Footer";
import Sidebar from "@/app/dashboard/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHeaderCollapsed, setHeaderCollapsed] = useState(false);

  const handleToggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const handleToggleRightSidebar = () => setHeaderCollapsed((prev) => !prev);

  return (
    <div className={styles.dashboardContainer}>
      <Header
        onToggleSidebar={handleToggleSidebar}
        onToggleRightSidebar={handleToggleRightSidebar}
      />

      <div className={styles.bodyArea}>
        <aside
          className={`${styles.sidebarWrapper} ${
            isSidebarCollapsed ? styles.sidebarCollapsed : ""
          }`}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} />
        </aside>

        <main
          className={`${styles.mainContentWrapper} ${
            isHeaderCollapsed ? styles.headerCollapsed : ""
          }`}
        >
          <div className={styles.dashboardContent}>{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
