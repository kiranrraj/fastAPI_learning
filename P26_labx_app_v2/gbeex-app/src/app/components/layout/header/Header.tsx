// src/app/components/layout/header/Header.tsx

"use client";

import React from "react";
import HeaderLeft from "@/app/components/layout/header/HeaderLeft";
import HeaderRight from "@/app/components/layout/header/HeaderRight";
import styles from "@/app/components/styles/header/Header.module.css";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header
      className={`w-full px-4 py-2 border-b bg-white dark:bg-gray-900 flex justify-between items-center ${styles.header} ${className}`}
    >
      <HeaderLeft />
      <HeaderRight />
    </header>
  );
};

export default React.memo(Header);
