"use client";

import React, { useState, useEffect } from "react";
import { LogIn, LogOut } from "lucide-react";
import styles from "./SignOutPage.module.css";

// Define the type for the component's props
interface SignOutPageProps {
  onReturnToSignIn: () => void;
}

export default function SignOutPage({ onReturnToSignIn }: SignOutPageProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      onReturnToSignIn();
      return;
    }

    // Set up the interval to decrement the countdown
    const timerId = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    // Clean up the interval when the component unmounts or countdown changes
    return () => clearInterval(timerId);
  }, [countdown, onReturnToSignIn]);

  return (
    <div className={styles.signOutContainer}>
      <LogOut className={styles.signOutIcon} />
      <h1 className={styles.signOutTitle}>You have been signed out.</h1>
      <p className={styles.signOutSubtitle}>
        Thank you for using the GBeex Knowledge Dashboard. You can sign back in
        at any time.
      </p>
      <button
        onClick={onReturnToSignIn}
        className={`btn btn-primary ${styles.signInButton}`}
      >
        <LogIn className="w-5 h-5 mr-2" />
        Return to Sign In ({countdown})
      </button>
    </div>
  );
}
