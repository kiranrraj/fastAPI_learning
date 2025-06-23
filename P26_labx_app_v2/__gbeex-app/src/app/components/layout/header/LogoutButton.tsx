// src/app/components/layout/header/LogoutButton.tsx
import React from "react";
import IconLogout from "@/app/components/icons/IconLogout";
import styles from "@/app/components/styles/header/LogoutButton.module.css";

interface LogoutButtonProps {
  onLogout?: () => void;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  className = "",
}) => {
  const handleLogout = () => {
    if (onLogout) onLogout();
    else console.log("Logged out");
  };

  return (
    <button
      onClick={handleLogout}
      className={`p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 ${styles.logoutButton} ${className}`}
      aria-label="Logout"
      title="Logout"
    >
      <IconLogout className="text-gray-800 dark:text-gray-200" />
    </button>
  );
};

export default React.memo(LogoutButton);
