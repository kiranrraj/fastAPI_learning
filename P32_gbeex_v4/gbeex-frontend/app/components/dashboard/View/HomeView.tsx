// app/components/dashboard/view/HomeView.tsx
"use client";

import React from "react";
import styles from "./HomeView.module.css";

export default function HomeView() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to GBeeX Dashboard</h2>
      <p className={styles.message}>
        To get started, select an existing item from the sidebar or click
        “Register Portlet” to create a new one.
      </p>
    </div>
  );
}
