"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import TabManager from "./TabManager";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className={styles.layoutContainer}>
      <Header toggleSidebar={toggleSidebar} />
      <div className={styles.layoutMain}>
        <TabManager collapsed={!sidebarVisible} />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
