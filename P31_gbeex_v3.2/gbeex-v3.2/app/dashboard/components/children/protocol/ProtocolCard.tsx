"use client";

import React, { useContext } from "react";
import type { Protocol as RawProtocol } from "@/app/types";
import { CompanyContext } from "@/app/contexts/company/CompanyContext";
import styles from "./ProtocolCard.module.css";

interface ProtocolCardProps {
  protocol: RawProtocol;
}

export default function ProtocolCard({ protocol }: ProtocolCardProps) {
  const { openTab } = useContext(CompanyContext)!;

  const completedOn =
    protocol.timelineDelays?.actualCompletionDate ||
    protocol.timelineDelays?.expectedCompletionDate ||
    "";

  return (
    <div className={styles.card} onClick={() => openTab(protocol)}>
      <h3 className={styles.title}>{protocol.protocolName}</h3>
      <div className={styles.detail}>
        <span>Sites:</span> <strong>{protocol.sites.length}</strong>
      </div>
      <div className={styles.detail}>
        <span>Enrolled:</span>{" "}
        <strong>{protocol.progressMetrics.enrolled}</strong>
      </div>
      <div className={styles.detail}>
        <span>Completion:</span>{" "}
        <strong>{protocol.progressMetrics.completionPercentage}%</strong>
      </div>
      <div className={styles.detail}>
        <span>Completed On:</span>{" "}
        <strong>
          {completedOn ? new Date(completedOn).toLocaleDateString() : "—"}
        </strong>
      </div>
    </div>
  );
}
