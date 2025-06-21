// src/app/components/layout/header/HelpButton.tsx
import React from "react";
import IconHelp from "@/app/components/icons/IconHelp";
import styles from "@/app/components/styles/header/HelpButton.module.css";

interface HelpButtonProps {
  onClick?: () => void;
  className?: string;
}

const HelpButton: React.FC<HelpButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick || (() => console.log("Help clicked"))}
      className={`p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 ${styles.helpButton} ${className}`}
      aria-label="Help"
      title="Help"
    >
      <IconHelp className="text-gray-800 dark:text-gray-200" />
    </button>
  );
};

export default React.memo(HelpButton);
