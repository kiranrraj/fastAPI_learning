"use client";

import React, { useContext } from "react";
import type { Protocol as RawProtocol } from "@/app/types";
import { CompanyContext } from "@/app/contexts/company/CompanyContext";
import styles from "./ProtocolTable.module.css"; // you can style as needed

interface Props {
  data: RawProtocol[];
}

export default function ProtocolTable({ data }: Props) {
  const { openTab } = useContext(CompanyContext)!;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Protocol Name</th>
          <th>Sites</th>
          <th>Enrolled</th>
          <th>Completion %</th>
          <th>Completed On</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p) => {
          const completedOn =
            p.timelineDelays?.actualCompletionDate ||
            p.timelineDelays?.expectedCompletionDate ||
            "";
          return (
            <tr
              key={p.protocolId}
              onClick={() => openTab(p)}
              className={styles.row}
            >
              <td>{p.protocolName}</td>
              <td>{p.sites.length}</td>
              <td>{p.progressMetrics.enrolled}</td>
              <td>{p.progressMetrics.completionPercentage}%</td>
              <td>
                {completedOn ? new Date(completedOn).toLocaleDateString() : "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
