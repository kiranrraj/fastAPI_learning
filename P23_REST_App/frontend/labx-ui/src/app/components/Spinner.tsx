// src/app/components/Spinner.tsx
"use client";

import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.spinner}>Loading...</div>
    </div>
  );
};

export default Spinner;
