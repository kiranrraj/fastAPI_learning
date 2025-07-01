// src/app/components/layout/header/ThemeToggle.tsx
"use client";

import React from "react";
import { SunMoon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

const ThemeToggle: React.FC = () => {
  const toggleTheme = () => {
    // Replace with real theme logic
    console.log("Toggle theme");
  };

  return (
    <button
      className={styles.headerBtn}
      onClick={toggleTheme}
      title="Toggle Theme"
    >
      <SunMoon size={20} />
    </button>
  );
};

export default ThemeToggle;
