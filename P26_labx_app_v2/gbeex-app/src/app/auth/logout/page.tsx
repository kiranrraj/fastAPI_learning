// /app/auth/logout/page.tsx
"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./LogoutPage.module.css";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      await signOut({ redirect: false });

      localStorage.clear();
      sessionStorage.clear();

      // Delay for user feedback, then go to signin
      setTimeout(() => {
        router.replace("/auth/signin");
      }, 5000);
    };

    doLogout();
  }, [router]);

  return (
    <div className={styles.logoutContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Signed Out</h1>
        <p className={styles.message}>You have been successfully signed out.</p>
        <p className={styles.message}>Redirecting to Sign In...</p>
      </div>
    </div>
  );
}
