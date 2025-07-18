// app/dashboard/components/children/ChildrenSection.tsx
"use client";

import React from "react";
import { useDetailContext } from "@/app/contexts/detail/DetailContext";
import ProtocolCard from "./protocol/ProtocolCard";
import ProtocolTable from "./protocol/ProtocolTable";
import SiteCard from "./site/SiteCard";
import SiteTable from "./site/SiteTable";
import SubjectList from "./subject/SubjectList";
import styles from "./ChildrenSection.module.css";

export default function ChildrenSection({
  viewMode,
  onViewModeChange,
}: {
  viewMode: "card" | "table";
  onViewModeChange: (m: "card" | "table") => void;
}) {
  const { nodeType, children } = useDetailContext();

  const title =
    nodeType === "company"
      ? "Protocols"
      : nodeType === "protocol"
      ? "Sites"
      : "Subjects";

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>
          {title} <span className={styles.count}>({children.length})</span>
        </h2>
        <div className={styles.toggle}>
          <button
            onClick={() => onViewModeChange("card")}
            className={viewMode === "card" ? styles.active : ""}
          >
            Cards
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={viewMode === "table" ? styles.active : ""}
          >
            Table
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {viewMode === "card" ? (
          <div className={styles.grid}>
            {nodeType === "company" &&
              (children as any).map((p: any) => (
                <ProtocolCard key={p.protocolId} protocol={p} />
              ))}

            {nodeType === "protocol" &&
              (children as any).map((s: any) => (
                <SiteCard key={s.siteId} site={s} />
              ))}

            {nodeType === "site" && <SubjectList subjects={children as any} />}
          </div>
        ) : nodeType === "company" ? (
          <ProtocolTable data={children as any} />
        ) : nodeType === "protocol" ? (
          <SiteTable data={children as any} />
        ) : (
          <SubjectList subjects={children as any} />
        )}
      </div>
    </section>
  );
}
