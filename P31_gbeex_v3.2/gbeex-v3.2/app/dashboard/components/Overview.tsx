// app/dashboard/components/Overview.tsx

"use client";

import React, { useContext } from "react";
import { CompanyContext } from "@/app/contexts/company/CompanyContext";
import NodeCardGrid from "@/app/dashboard/components/node/NodeCardGrid";
import styles from "./Overview.module.css";

export default function Overview() {
  const context = useContext(CompanyContext);

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
      <p className={styles.subtitle}>
        Select a company to view its protocols in a new tab.
      </p>
      <NodeCardGrid nodes={companies} variant="overview" />
    </div>
  );
}
