// app/components/dashboard/Portlet/Registration/PortletPreviewPanel.tsx
import React from "react";
import styles from "./PortletRegistrationForm.module.css";
import type {
  PortletBase,
  PortletCategory,
  PortletRenderMechanism,
} from "@/app/types/portlet";

interface PortletPreviewPanelProps {
  payload: PortletBase;
  handleSubmit: () => void;
  setIsPreviewMode: (mode: boolean) => void;
  isLoading: boolean;
}

const PortletPreviewPanel: React.FC<PortletPreviewPanelProps> = ({
  payload,
  handleSubmit,
  setIsPreviewMode,
  isLoading,
}) => {
  return (
    <div className={styles.previewContainer}>
      <h3 className={styles.previewTitle}>Portlet Details Preview</h3>
      <p className={styles.subtitle}>
        Please review the details below before confirming registration.
      </p>

      <div className={styles.previewGrid}>
        <div>
          <strong>Portlet Key:</strong>
        </div>
        <div>{payload.key}</div>
        <div>
          <strong>Title:</strong>
        </div>
        <div>{payload.title}</div>
        <div>
          <strong>Category:</strong>
        </div>
        <div>{payload.category}</div>
        <div>
          <strong>Description:</strong>
        </div>
        <div>{payload.description}</div>
        <div>
          <strong>Enabled:</strong>
        </div>
        <div>{payload.enabled ? "Yes" : "No"}</div>
        <div>
          <strong>Order:</strong>
        </div>
        <div>{payload.order}</div>
        <div>
          <strong>Render As:</strong>
        </div>
        <div>
          {payload.renderMechanism === "component"
            ? "Local React Component"
            : "External URL (Iframe)"}
        </div>
        {payload.renderMechanism === "iframe" && (
          <>
            <div>
              <strong>URL:</strong>
            </div>
            <div>{payload.url || "N/A"}</div>
          </>
        )}
        {payload.renderMechanism === "component" && (
          <>
            <div>
              <strong>Component Name:</strong>
            </div>
            <div>{payload.componentName || "N/A"}</div>
          </>
        )}
        <div>
          <strong>Is Child Portlet:</strong>
        </div>
        <div>{payload.isChild ? "Yes" : "No"}</div>
        {payload.isChild && (
          <>
            <div>
              <strong>Parent Path:</strong>
            </div>
            <div>{payload.parentPath || "N/A"}</div>
          </>
        )}
        <div>
          <strong>Created By:</strong>
        </div>
        <div>{payload.createdBy}</div>
      </div>

      {payload.longDescription && (
        <div className={styles.previewSection}>
          <h4>Long Description:</h4>
          <p className={styles.previewText}>{payload.longDescription}</p>
        </div>
      )}
      {payload.testNotes && (
        <div className={styles.previewSection}>
          <h4>Test Notes:</h4>
          <p className={styles.previewText}>{payload.testNotes}</p>
        </div>
      )}
      {Object.keys(payload.settings || {}).length > 0 && (
        <div className={styles.previewSection}>
          <h4>Settings (JSON):</h4>
          <pre className={styles.previewCode}>
            {JSON.stringify(payload.settings, null, 2)}
          </pre>
        </div>
      )}

      <div className={styles.formActions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Confirm & Register"}
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => setIsPreviewMode(false)}
          disabled={isLoading}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default PortletPreviewPanel;
