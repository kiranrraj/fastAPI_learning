// app/dashboard/DashboardLayout.tsx
"use client";

import { useState } from "react";
import AppProviders from "@/app/contexts/AppProvider";
import Header from "@/app/dashboard/components/Header/Header";
import Sidebar from "@/app/dashboard/components/Sidebar/Sidebar";
import Footer from "./components/Footer";
import styles from "./Dashboard.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHeaderCollapsed, setHeaderCollapsed] = useState(false);

  const handleToggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const handleToggleHeader = () => setHeaderCollapsed((prev) => !prev);

  return (
    <AppProviders>
      <div className={styles.dashboardContainer}>
        <Header
          onToggleSidebar={handleToggleSidebar}
          onToggleHeader={handleToggleHeader}
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
    </AppProviders>
  );
}
