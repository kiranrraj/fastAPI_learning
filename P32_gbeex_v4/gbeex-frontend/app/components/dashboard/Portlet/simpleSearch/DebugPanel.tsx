// app/components/portlets/DebugPanel.tsx
import React from "react";
import styles from "./SimpleSearch.module.css";

interface DebugPanelProps {
  rawResponse: any;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ rawResponse }) => {
  if (!rawResponse) return null;

  return (
    <div className={styles.debugPanel}>
      <h3 className={styles.debugTitle}>Raw API Response</h3>
      <textarea
        className={styles.debugJson}
        value={JSON.stringify(rawResponse, null, 2)}
        readOnly
      />
    </div>
  );
};

export default DebugPanel;
