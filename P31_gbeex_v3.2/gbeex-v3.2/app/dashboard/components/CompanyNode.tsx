"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import styles from "@/app/dashboard/components/Sidebar.module.css";
import { Company, Protocol, Site } from "@/app/types/types";

type Node = Company | Protocol | Site;

interface CompanyNodeProps {
  node: Node;
  level: number;
}

export default function CompanyNode({ node, level }: CompanyNodeProps) {
  const [expanded, setExpanded] = useState(false);

  const hasChildren = "protocols" in node || "sites" in node;

  const toggle = () => setExpanded(!expanded);

  return (
    <div className={styles.node} style={{ marginLeft: `${level * 2}px` }}>
      <div className={styles.nodeLabel} onClick={toggle}>
        {hasChildren &&
          (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        <span>
          {"companyName" in node
            ? node.companyName
            : "protocolName" in node
            ? node.protocolName
            : node.siteName}
        </span>
      </div>

      {/* Protocols */}
      {expanded &&
        "protocols" in node &&
        node.protocols?.map((protocol: Protocol) => (
          <CompanyNode
            key={protocol.protocolId}
            node={protocol}
            level={level + 1}
          />
        ))}

      {/* Sites */}
      {expanded &&
        "sites" in node &&
        node.sites?.map((site: Site) => (
          <CompanyNode key={site.siteId} node={site} level={level + 1} />
        ))}
    </div>
  );
}
