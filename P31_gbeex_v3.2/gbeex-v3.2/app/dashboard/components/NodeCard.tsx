import React, { useContext } from "react";
import { Company, Protocol, Site, Subject, Node } from "@/app/types";
import {
  CompanyContext,
  CompanyContextType,
} from "@/app/contexts/company/CompanyContext";
import { Building2, FlaskConical, MapPin, TestTube2 } from "lucide-react";
import styles from "./NodeCard.module.css";

const getNodeDetails = (node: Node) => {
  if ("companyId" in node)
    return {
      name: node.companyName,
      type: "Company",
      icon: <Building2 />,
      childrenCount: node.protocols.length,
    };
  if ("protocolId" in node)
    return {
      name: node.protocolName,
      type: "Protocol",
      icon: <FlaskConical />,
      childrenCount: node.sites.length,
    };
  if ("siteId" in node)
    return {
      name: node.siteName,
      type: "Site",
      icon: <MapPin />,
      childrenCount: node.subjects.length,
    };
  if ("subjectId" in node)
    return {
      name: node.subjectId,
      type: "Subject",
      icon: <TestTube2 />,
      childrenCount: 0,
    };
  return { name: "Unknown", type: "Unknown", icon: <></>, childrenCount: 0 };
};

export default function NodeCard({ node }: { node: Node }) {
  const { handleNodeSelect } = useContext(CompanyContext) as CompanyContextType;
  const { name, type, icon, childrenCount } = getNodeDetails(node);

  return (
    <div className={styles.card} onClick={() => handleNodeSelect(node)}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>{icon}</div>
        <span className={styles.nodeType}>{type}</span>
      </div>
      <h3 className={styles.nodeName}>{name}</h3>
      <p className={styles.childrenInfo}>
        {"subjectId" in node
          ? `Status: ${node.status}`
          : `${childrenCount} Children`}
      </p>
    </div>
  );
}
