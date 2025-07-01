"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import styles from "./LogoutButton.module.css";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/logout");
  };

  return (
    <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
      <LogOut size={18} className={styles.icon} />
      <span className={styles.label}>Logout</span>
    </button>
  );
};

export default LogoutButton;
