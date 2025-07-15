"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import styles from "./SignOutPage.module.css";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false });
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleRedirectNow = () => {
    router.push("/auth/login");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>You have been signed out.</h2>
      <p className={styles.subtext}>
        You'll be redirected to sign in in 10 seconds.
      </p>
      <button className={styles.button} onClick={handleRedirectNow}>
        Go to Sign In Now
      </button>
    </div>
  );
}
