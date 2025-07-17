// app/dashboard/components/DetailViews/SubjectDetailView.tsx

import React from "react";
import { Subject } from "@/app/types";
import styles from "./SubjectDetailView.module.css";
import {
  User,
  Globe,
  Activity,
  Calendar,
  CheckCircle,
  BookOpen,
  DollarSign,
  Wifi,
  AlertTriangle,
} from "lucide-react";

const DetailItem = ({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | boolean;
  highlight?: boolean;
}) => (
  <div className={styles.detailItem}>
    <div className={styles.detailIcon}>{icon}</div>
    <div>
      <div className={styles.detailLabel}>{label}</div>
      <div
        className={`${styles.detailValue} ${highlight ? styles.highlight : ""}`}
      >
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </div>
    </div>
  </div>
);

export const SubjectDetail = ({ subject }: { subject: Subject }) => (
  <div className={styles.detailHeader}>
    <div className={styles.headerTitle}>
      <User size={32} />
      <h2>{subject.subjectId}</h2>
      <span
        className={`${styles.statusBadge} ${
          styles[subject.status?.toLowerCase() ?? ""]
        }`}
      >
        {subject.status}
      </span>
    </div>
    <div className={styles.headerGrid}>
      <DetailItem icon={<User />} label="Age" value={subject.age} />
      <DetailItem icon={<User />} label="Gender" value={subject.gender} />
      <DetailItem
        icon={<Globe />}
        label="Ethnicity"
        value={subject.ethnicity}
      />
      <DetailItem icon={<Activity />} label="BMI" value={subject.BMI} />
      <DetailItem
        icon={<Calendar />}
        label="Visit Count"
        value={subject.visitCount}
      />
      <DetailItem
        icon={<CheckCircle />}
        label="Adherence Score"
        value={`${subject.adherenceScore}%`}
      />
      <DetailItem
        icon={<BookOpen />}
        label="Education"
        value={subject.educationLevel}
      />
      <DetailItem
        icon={<DollarSign />}
        label="Income Bracket"
        value={subject.incomeBracket}
      />
      <DetailItem
        icon={<Wifi />}
        label="Digital Engagement"
        value={subject.digitalEngagementLevel}
      />
      <DetailItem
        icon={<CheckCircle />}
        label="Vaccinated"
        value={subject.vaccinationStatus}
      />
      <DetailItem
        icon={<AlertTriangle />}
        label="Protocol Deviation"
        value={subject.protocolDeviation}
        highlight={subject.protocolDeviation}
      />
      <DetailItem
        icon={<User />}
        label="Progress Status"
        value={subject.progressStatus}
      />
    </div>
    <div className={styles.complicationsSection}>
      <h4 className={styles.complicationsTitle}>Complications</h4>
      {subject.complications &&
      subject.complications.length > 0 &&
      subject.complications[0].toLowerCase() !== "none" ? (
        <div className={styles.complicationsGrid}>
          {subject.complications.map((c) => (
            <span key={c} className={styles.complicationTag}>
              {c}
            </span>
          ))}
        </div>
      ) : (
        <p className={styles.noComplications}>No complications reported.</p>
      )}
    </div>
  </div>
);
