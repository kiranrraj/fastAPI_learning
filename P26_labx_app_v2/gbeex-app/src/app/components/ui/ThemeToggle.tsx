// src/app/components/ui/ThemeToggle.tsx
"use client";

import React, { useEffect, useState } from "react";
import IconThemeLight from "@/app/components/icons/IconThemeLight";
import IconThemeDark from "@/app/components/icons/IconThemeDark";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDark(storedTheme === "dark");
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 ${styles.themeToggleButton} ${className}`}
      aria-label="Toggle Theme"
      title="Toggle Theme"
    >
      {isDark ? (
        <IconThemeLight className="text-yellow-500" />
      ) : (
        <IconThemeDark className="text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
};

export default React.memo(ThemeToggle);
