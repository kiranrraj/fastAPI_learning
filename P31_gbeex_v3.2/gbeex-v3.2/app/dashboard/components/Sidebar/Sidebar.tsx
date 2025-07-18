"use client";

import React, { useContext } from "react";
import SidebarHeader from "@/app/dashboard/components/Sidebar/SidebarHeader";
import SidebarViewSwitcher from "@/app/dashboard/components/Sidebar/SidebarViewSwitcher";
import CompanyTree from "@/app/dashboard/components/CompanyTree";
import { SidebarContext } from "@/app/contexts/sidebar/SidebarContext";
import { CompanyContext } from "@/app/contexts/company/CompanyContext";
import styles from "./Sidebar.module.css";
import type { Node } from "@/app/types";

type SidebarProps = {
  isCollapsed: boolean;
  // Optional callback invoked when any node (company/protocol/site/subject)
  // in the tree is clicked, so you can open it in a new tab.
  onNodeClick?: (node: Node) => void;
};

export default function Sidebar({ isCollapsed, onNodeClick }: SidebarProps) {
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

      {/*
        Original tree without tab support(for rollback):
        <CompanyTree companies={getFilteredCompanies()} />
      */}
      <CompanyTree
        companies={getFilteredCompanies()}
        // Now forward clicks for tab creation
        onNodeClick={onNodeClick}
      />
    </div>
  );
}
