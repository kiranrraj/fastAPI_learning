"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./LogoutPage.module.css";

const LOGOUT_DELAY = 5;

export default function LogoutPage() {
  const [countdown, setCountdown] = useState(LOGOUT_DELAY);
  const router = useRouter();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const performLogout = async () => {
      await signOut({ redirect: false });

      intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    };

    performLogout();

    return () => clearInterval(intervalId);
  }, []);

  // Redirect safely outside of render/update cycle
  useEffect(() => {
    if (countdown === 0) {
      router.push("/auth/signin");
    }
  }, [countdown, router]);

  return (
    <div className={styles.logoutContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Signed Out</h1>
        <p className={styles.message}>You have been successfully signed out.</p>
        <p className={styles.redirectNote}>
          Redirecting to sign-in in {countdown} second
          {countdown !== 1 ? "s" : ""}...
        </p>
        <button
          onClick={() => router.push("/auth/signin")}
          className={styles.signinButton}
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}
