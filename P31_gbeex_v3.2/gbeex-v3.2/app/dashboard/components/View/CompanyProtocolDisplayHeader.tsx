// app/dashboard/components/View/CompanyProtocolDisplayHeader.tsx
"use client";

import React from "react";
import { Company } from "@/app/types";
import { Grid as CardIcon, Table as TableIcon } from "lucide-react";
import { CompanyDetailHeader } from "./CompanyDetailHeader";
import styles from "./CompanyDetailView.module.css";

interface CompanyProtocolDisplayHeaderProps {
  company: Company;
  viewMode: "card" | "table";
  setViewMode: (mode: "card" | "table") => void;
}

export default function CompanyProtocolDisplayHeader({
  company,
  viewMode,
  setViewMode,
}: CompanyProtocolDisplayHeaderProps) {
  return (
    <div className={styles.headerWrapper}>
      <CompanyDetailHeader company={company} />

      <div className={styles.viewSwitch}>
        <button
          onClick={() => setViewMode("card")}
          className={viewMode === "card" ? styles.active : ""}
          aria-label="Card View"
        >
          <CardIcon size={20} />
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={viewMode === "table" ? styles.active : ""}
          aria-label="Table View"
        >
          <TableIcon size={20} />
        </button>
      </div>
    </div>
  );
}
