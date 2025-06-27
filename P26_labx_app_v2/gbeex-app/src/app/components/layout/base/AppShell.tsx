// AppShell.tsx
"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import MainSection from "./MainSection";
import styles from "./AppShell.module.css";

const AppShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.appShell}>
      <Header />
      <MainSection />
    </div>
  );
};

export default AppShell;
