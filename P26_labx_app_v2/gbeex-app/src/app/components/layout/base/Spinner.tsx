import React from "react";
import styles from "./Spinner.module.css";

const Spinner: React.FC = () => (
  <div className={styles.spinnerOverlay}>
    <div className={styles.spinner} />
  </div>
);

export default Spinner;
