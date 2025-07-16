import React from "react";
import { Subject } from "@/app/types";
import styles from "./SubjectCard.module.css";

export default function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{subject.subjectId}</h2>
        <span className={styles.statusBadge}>{subject.status}</span>
      </div>
      <div className={styles.detailsGrid}>
        <div>
          <strong>Age:</strong> {subject.demographics.age}
        </div>
        <div>
          <strong>Sex:</strong> {subject.demographics.sex}
        </div>
        <div>
          <strong>Ethnicity:</strong> {subject.demographics.ethnicity}
        </div>
        <div>
          <strong>Treatment Arm:</strong> {subject.clinical.treatmentArm}
        </div>
        <div>
          <strong>AEs:</strong> {subject.clinical.adverseEventsCount}
        </div>
        <div>
          <strong>eCRF Status:</strong> {subject.operational.eCRFStatus}
        </div>
      </div>
    </div>
  );
}
