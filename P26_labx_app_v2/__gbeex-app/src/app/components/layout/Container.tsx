// src/app/components/layout/Container.tsx

"use client";

import React from "react";
import styles from "@/app/components/styles/Container.module.css";

interface ContainerProps {
  children?: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`${styles.container} ${className}`}
      role="region"
      aria-label="App container"
    >
      {children}
    </div>
  );
};

export default React.memo(Container);
