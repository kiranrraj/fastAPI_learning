// src/app/components/layout/header/HeaderLeft.tsx
import React from "react";
import Image from "next/image";
import styles from "@/app/components/styles/header/HeaderLeft.module.css";

interface HeaderLeftProps {
  logoSrc?: string;
  appName?: string;
  className?: string;
}

const HeaderLeft: React.FC<HeaderLeftProps> = ({
  logoSrc = "/logo.svg",
  appName = "Gbeex App",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-2 ${styles.headerLeft} ${className}`}
    >
      <Image
        src={logoSrc}
        alt="App Logo"
        width={32}
        height={32}
        className="w-8 h-8"
        priority
      />
      <span className="text-xl font-semibold text-gray-800 dark:text-white">
        {appName}
      </span>
    </div>
  );
};

export default React.memo(HeaderLeft);
