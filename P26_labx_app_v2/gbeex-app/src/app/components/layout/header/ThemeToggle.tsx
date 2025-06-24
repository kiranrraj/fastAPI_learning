"use client";

import React, { useEffect, useState } from "react";
import Toggle from "@/app/components/ui/Toggle";
import styles from "@/app/components/layout/header/ThemeToggle.module.css";

/**
 * Component: ThemeToggle
 * ----------------------------
 * This module toggles between light and dark mode using class on `<html>`.
 * It uses a reusable Toggle component for icon switching.
 *
 * INPUT: none (uses `localStorage` and DOM class directly)
 * OUTPUT: Updates the theme globally and shows toggle icon
 */

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // On mount: detect and apply saved theme or system preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldUseDark = saved === "dark" || (!saved && prefersDark);
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <Toggle
      className={styles.headerBtn}
      isActive={isDark}
      onToggle={toggleTheme}
      label="Toggle theme"
      tooltip={isDark ? "Switch to light mode" : "Switch to dark mode"}
      activeContent="🌙"
      inactiveContent="☀️"
    />
  );
};

export default ThemeToggle;
