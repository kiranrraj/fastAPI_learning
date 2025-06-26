import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import MainSection from "./MainSection";
import styles from "./AppShell.module.css";

/**
 * Component: AppShell
 * -------------------
 * Base wrapper for the entire application layout.
 * Includes: Header, MainSection (Sidebar + Content), Footer.
 *
 * INPUT: none
 * OUTPUT: Render full SPA layout structure.
 */
const AppShell: React.FC = () => {
  return (
    <div className={styles.appShell}>
      <Header />
      <MainSection />
    </div>
  );
};

export default AppShell;
