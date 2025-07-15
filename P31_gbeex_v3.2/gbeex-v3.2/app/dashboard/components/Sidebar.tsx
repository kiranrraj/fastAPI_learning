// app/dashboard/components/Sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { CompanyTree } from "@/app/dashboard/components/CompanyTree";
import { Company } from "@/app/types/types";

interface SidebarProps {
  isCollapsed: boolean;
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/api/v1/dev/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Failed to load companies:", err));
  }, []);

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      <h3 className={styles.title}>Companies</h3>
      <div className={styles.scrollArea}>
        {companies.map((company) => (
          <CompanyTree key={company.companyId} company={company} />
        ))}
      </div>
    </aside>
  );
}
