// /app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.message}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => router.push("/auth/signin")}
          className={styles.button}
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}
