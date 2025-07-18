// components/table/ProtocolCard.tsx

import React from "react";
import { Protocol } from "@/app/components/table/protocolColumns";
import styles from "./ProtocolCard.module.css";

export default function ProtocolCard({ protocol }: { protocol: Protocol }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{protocol.name}</h3>
      <div className={styles.detail}>
        <span>Sites:</span> <strong>{protocol.siteCount}</strong>
      </div>
      <div className={styles.detail}>
        <span>Enrolled:</span> <strong>{protocol.enrolled}</strong>
      </div>
      <div className={styles.detail}>
        <span>Completion:</span> <strong>{protocol.completionPct}%</strong>
      </div>
      <div className={styles.detail}>
        <span>Completed On:</span>{" "}
        <strong>{new Date(protocol.lastUpdated).toLocaleDateString()}</strong>
      </div>
    </div>
  );
}
