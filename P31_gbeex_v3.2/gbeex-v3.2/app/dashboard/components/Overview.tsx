"use client";

import React, { useContext } from "react";
import {
  CompanyContext,
  CompanyContextType,
} from "@/app/contexts/company/CompanyContext";
import NodeCardGrid from "./NodeCardGrid"; // We'll use this to display the cards
import styles from "./Overview.module.css";

export default function Overview() {
  const context = useContext(CompanyContext);

  // Show a loading state while context is initializing or data is being fetched
  if (!context || context.isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading companies...</p>
      </div>
    );
  }

  const { companies } = context;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Companies Overview</h1>
      <p className={styles.subtitle}>Select a company to view its protocols.</p>
      <NodeCardGrid nodes={companies} />
    </div>
  );
}
