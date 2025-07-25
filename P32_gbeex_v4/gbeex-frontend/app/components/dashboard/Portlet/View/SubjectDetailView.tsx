// app/components/portlets/SubjectDetailView.tsx
"use client";

import React from "react";
import type { Subject } from "@/app/types/subjects";
import styles from "./SubjectDetailView.module.css";

interface SubjectDetailViewProps {
  subject: Subject; // The full subject data to display
  onBack: () => void; // Callback to go back to the previous view (e.g., list of subjects)
}

/**
 * SubjectDetailView component displays all the detailed information for a single subject.
 * It also provides a way to navigate back to the previous view.
 */
const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  onBack,
}) => {
  if (!subject) {
    return <div className={styles.noData}>No subject data available.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          &larr; Back to Subjects
        </button>
        <h2 className={styles.title}>
          Subject Details: {subject.screeningNumber}
        </h2>
      </div>

      <div className={styles.detailGrid}>
        {/* Basic Details */}
        <div className={styles.gridSection}>
          <h3>General Information</h3>
          <p>
            <strong>Subject ID:</strong> {subject.subjectId}
          </p>
          <p>
            <strong>Screening No.:</strong> {subject.screeningNumber}
          </p>
          <p>
            <strong>Medical Record No.:</strong> {subject.medicalRecordNumber}
          </p>
          <p>
            <strong>Age:</strong> {subject.age}
          </p>
          <p>
            <strong>Gender:</strong> {subject.gender}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(subject.dateOfBirth).toLocaleDateString()}
          </p>
          <p>
            <strong>Ethnicity:</strong> {subject.ethnicity}
          </p>
        </div>

        {/* Trial Information */}
        <div className={styles.gridSection}>
          <h3>Trial Information</h3>
          <p>
            <strong>Status:</strong> {subject.status}
          </p>
          <p>
            <strong>Final Status:</strong> {subject.finalStatus || "N/A"}
          </p>
          <p>
            <strong>Treatment Arm:</strong> {subject.treatmentArm}
          </p>
          <p>
            <strong>Enrollment Date:</strong>{" "}
            {new Date(subject.dateOfEnrollment).toLocaleDateString()}
          </p>
          <p>
            <strong>Randomization Date:</strong>{" "}
            {new Date(subject.randomizationDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Visit:</strong>{" "}
            {new Date(subject.lastVisitDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Next Visit:</strong>{" "}
            {new Date(subject.nextScheduledVisit).toLocaleDateString()}
          </p>
          <p>
            <strong>Visit Count:</strong> {subject.visitCount}
          </p>
          <p>
            <strong>Progress Status:</strong> {subject.progressStatus}
          </p>
          <p>
            <strong>Protocol Deviation:</strong> {subject.protocolDeviation}
          </p>
          <p>
            <strong>Discontinuation Reason:</strong>{" "}
            {subject.discontinuationReason || "N/A"}
          </p>
          <p>
            <strong>Dropout Reason:</strong> {subject.dropoutReason || "N/A"}
          </p>
        </div>

        {/* Medical & Lifestyle */}
        <div className={styles.gridSection}>
          <h3>Medical & Lifestyle</h3>
          <p>
            <strong>Height:</strong> {subject.heightCm} cm
          </p>
          <p>
            <strong>Weight:</strong> {subject.weightKg} kg
          </p>
          <p>
            <strong>BMI:</strong> {subject.BMI}
          </p>
          <p>
            <strong>Blood Type:</strong> {subject.bloodType}
          </p>
          <p>
            <strong>Vital Signs (BP/HR):</strong>{" "}
            {subject.vitalSigns.bloodPressure} / {subject.vitalSigns.heartRate}
          </p>
          <p>
            <strong>Comorbidities:</strong>{" "}
            {subject.comorbidities.join(", ") || "None"}
          </p>
          <p>
            <strong>Prior Medications:</strong>{" "}
            {subject.priorMedications.join(", ") || "None"}
          </p>
          <p>
            <strong>Allergies:</strong> {subject.allergies.join(", ") || "None"}
          </p>
          <p>
            <strong>Smoking Status:</strong> {subject.smokingStatus}
          </p>
          <p>
            <strong>Alcohol Consumption:</strong> {subject.alcoholConsumption}
          </p>
          <p>
            <strong>Drug Use:</strong> {subject.drugUse}
          </p>
          <p>
            <strong>Dietary Restrictions:</strong> {subject.dietaryRestrictions}
          </p>
          <p>
            <strong>Vaccination Status:</strong> {subject.vaccinationStatus}
          </p>
          <p>
            <strong>Complications:</strong> {subject.complications}
          </p>
        </div>

        {/* Contextual & Other Details */}
        <div className={styles.gridSection}>
          <h3>Context & Other Info</h3>
          <p>
            <strong>Company:</strong> {subject.companyName || "N/A"}
          </p>
          <p>
            <strong>Protocol:</strong> {subject.protocolName || "N/A"}
          </p>
          <p>
            <strong>Site:</strong> {subject.siteName || "N/A"}
          </p>
          <p>
            <strong>Socioeconomic Status:</strong> {subject.socioeconomicStatus}
          </p>
          <p>
            <strong>Education Level:</strong> {subject.educationLevel}
          </p>
          <p>
            <strong>Adherence Score:</strong>{" "}
            {(subject.adherenceScore * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Medication Adherence:</strong>{" "}
            {(subject.medicationAdherence * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Study Drug Dosage:</strong> {subject.studyDrugDosage}
          </p>
          <p>
            <strong>Insurance Provider:</strong> {subject.insuranceProvider}
          </p>
          <p>
            <strong>Emergency Contact:</strong> {subject.emergencyContact.name}{" "}
            ({subject.emergencyContact.relation}) -{" "}
            {subject.emergencyContact.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailView;
