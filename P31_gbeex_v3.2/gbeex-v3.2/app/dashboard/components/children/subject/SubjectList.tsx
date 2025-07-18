"use client";

import React from "react";
import type { Subject } from "@/app/types";

export default function SubjectList({ subjects }: { subjects: Subject[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {subjects.map((sub) => (
        <li
          key={sub.subjectId}
          style={{
            padding: "0.5rem 1rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <strong>{sub.subjectId}</strong> – {sub.status}
        </li>
      ))}
    </ul>
  );
}
