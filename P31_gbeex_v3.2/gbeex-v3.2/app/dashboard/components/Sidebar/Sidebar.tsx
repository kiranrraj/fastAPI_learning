"use client";

import React, { useContext } from "react";
import SidebarHeader from "@/app/dashboard/components/Sidebar/SidebarHeader";
import SidebarViewSwitcher from "@/app/dashboard/components/Sidebar/SidebarViewSwitcher";
import CompanyTree from "@/app/dashboard/components/CompanyTree";
import { SidebarContext } from "@/app/contexts/sidebar/SidebarContext";
import { CompanyContext } from "@/app/contexts/company/CompanyContext";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  isCollapsed: boolean;
};

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const { companies } = useContext(CompanyContext)!;
  const { activeView } = useContext(SidebarContext)!;

  const getFilteredCompanies = () => {
    if (activeView === "all") return companies;
    if (activeView === "favorites" || activeView === "hidden") {
      return companies;
    }
    return companies;
  };

  return (
    <div
      className={`${styles.sidebar} ${
        isCollapsed ? styles.sidebarCollapsed : ""
      }`}
    >
      <SidebarHeader />
      <SidebarViewSwitcher />
      <CompanyTree companies={getFilteredCompanies()} />
    </div>
  );
}
