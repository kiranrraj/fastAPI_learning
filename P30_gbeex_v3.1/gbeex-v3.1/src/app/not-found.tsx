"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <AlertTriangle className={styles.icon} />
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.subtitle}>
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/dashboard" className={`btn btn-primary ${styles.button}`}>
          <Home className="w-5 h-5 mr-2" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
