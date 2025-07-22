// app/components/dashboard/Header/Header.tsx
"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

export function Header() {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/signout");
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.logo}>My Dashboard</h1>
        {/* other nav items here */}
      </div>
      <div className={styles.right}>
        {/* e.g. <NotificationsIcon /> */}
        <button onClick={handleLogout} className={styles.iconButton}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
