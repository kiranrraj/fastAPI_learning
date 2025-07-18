// app/dashboard/components/sidebar/CompanyTree.tsx

import React, { useContext } from "react";
import { Company, Node } from "@/app/types";
import { SidebarContext } from "@/app/contexts/sidebar/SidebarContext";
import CompanyTreeNode from "./CompanyTreeNode";
import styles from "./CompanyTree.module.css";

interface CompanyTreeProps {
  companies: Company[];
  onNodeClick?: (node: Node) => void;
}

export default function CompanyTree({
  companies,
  onNodeClick,
}: CompanyTreeProps) {
  const { activeView, favoriteIds, hiddenIds, searchQuery } =
    useContext(SidebarContext)!;

  const shouldRenderNode = (nodeId: string): boolean => {
    if (activeView === "favorites") return favoriteIds.has(nodeId);
    if (activeView === "hidden") return hiddenIds.has(nodeId);
    return !hiddenIds.has(nodeId);
  };

  const filterCompanies = (companies: Company[]) => {
    return companies
      .map((company) => filterCompanyNode(company))
      .filter((company): company is Company => company !== null);
  };

  const filterCompanyNode = (node: any): any => {
    const nodeId =
      node.companyId ?? node.protocolId ?? node.siteId ?? node.subjectId;

    const children = node.protocols ?? node.sites ?? node.subjects ?? [];

    const filteredChildren = children
      .map(filterCompanyNode)
      .filter((child: any) => child !== null);

    const matchQuery =
      searchQuery &&
      JSON.stringify(node).toLowerCase().includes(searchQuery.toLowerCase());

    if (shouldRenderNode(nodeId) || filteredChildren.length > 0 || matchQuery) {
      const newNode = { ...node };
      if ("protocols" in node) newNode.protocols = filteredChildren;
      if ("sites" in node) newNode.sites = filteredChildren;
      if ("subjects" in node) newNode.subjects = filteredChildren;
      return newNode;
    }

    return null;
  };

  const filtered = filterCompanies(companies);

  return (
    <div className={styles.treeWrapper}>
      {filtered.length === 0 ? (
        <div className={styles.empty}>No results found.</div>
      ) : (
        <>
          {/* Updated rendering with onNodeClick propagation: */}
          {filtered.map((company) => (
            <CompanyTreeNode
              key={company.companyId}
              node={company}
              level={0}
              onNodeClick={onNodeClick}
            />
          ))}
        </>
      )}
    </div>
  );
}
