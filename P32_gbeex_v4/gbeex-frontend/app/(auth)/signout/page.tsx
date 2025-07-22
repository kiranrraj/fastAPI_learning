// gbeex-frontend\app\(auth)\signout\page.tsx
// This must be a client component to use hooks

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signout.module.css";

export default function SignOutPage() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    // If the countdown reaches 0, redirect the user
    if (countdown <= 0) {
      router.push("/signin"); // Use router.push for client-side navigation
      return;
    }

    // Set up the timer
    const timerId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timerId);
  }, [countdown, router]); // Dependency array ensures effect re-runs if countdown changes

  return (
    <main className={styles.signoutContainer}>
      <div className={styles.signoutCard}>
        <div className={styles.cardContent}>
          {/* Success Icon */}
          <div className={styles.iconWrapper}>
            <svg
              className={styles.successIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Header Section */}
          <div className={styles.header}>
            <h1>Signed Out Successfully</h1>
            <p>You have been logged out of your account.</p>
          </div>

          {/* Redirect Button using Next.js Link */}
          <div className={styles.buttonWrapper}>
            <Link href="/signin" className={styles.btn}>
              Go to Sign-In Page
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className={styles.footer}>
            {countdown > 0 ? (
              <p>
                You will be redirected automatically in{" "}
                <span className={styles.countdownTimer}>{countdown}</span>{" "}
                seconds...
              </p>
            ) : (
              <p>Redirecting...</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
