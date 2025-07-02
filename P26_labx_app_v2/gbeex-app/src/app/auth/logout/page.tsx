"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./LogoutPage.module.css";
import { useLogoutCountdown } from "@/app/hooks/useLogoutCountDown";

const LOGOUT_DELAY = 5;

export default function LogoutPage() {
  const router = useRouter();

  // Use custom hook for logout and countdown
  const countdown = useLogoutCountdown(LOGOUT_DELAY, () => {
    router.push("/auth/signin");
  });

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
          aria-label="Go to Sign In now"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}
