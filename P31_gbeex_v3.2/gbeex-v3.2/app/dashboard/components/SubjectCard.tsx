// SubjectCard.tsx
import React from "react";
import { Subject } from "@/app/types";
import styles from "./SubjectCard.module.css";

export default function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <div className={styles.card}>
      <h3>Subject ID: {subject.subjectId}</h3>
      <p>Additional info can be shown here.</p>
    </div>
  );
}
