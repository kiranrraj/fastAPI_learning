// src/app/components/layout/header/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import styles from "./LogoutButton.module.css";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/logout");
  };

  return (
    <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
      Logout
    </button>
  );
};

export default LogoutButton;
