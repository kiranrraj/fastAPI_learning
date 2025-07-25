// app/components/dashboard/Portlet/Registration/PortletRenderMechanismForm.tsx
import React from "react";
import styles from "./PortletRegistrationForm.module.css";
import HelpTooltip from "@/app/components/common/HelpTooltip";
import type { PortletBase, PortletRenderMechanism } from "@/app/types/portlet";

interface PortletRenderMechanismFormProps {
  payload: PortletBase;
  handleChange: (k: keyof PortletBase, v: any) => void;
}

const PortletRenderMechanismForm: React.FC<PortletRenderMechanismFormProps> = ({
  payload,
  handleChange,
}) => {
  return (
    <>
      {/* Render As Radio Group with HelpTooltip */}
      <div className={styles.inputGroup}>
        <div className={styles.inputGroupHeader}>
          <label className={styles.label}>
            Render As <span className={styles.required}>*</span>
          </label>
          <HelpTooltip>
            Choose how the portlet's content will be rendered: as a pre-built
            React component directly within the application, or as an embedded
            external web page using an iframe.
          </HelpTooltip>
        </div>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="renderMechanism"
              value="component"
              checked={payload.renderMechanism === "component"}
              onChange={() =>
                handleChange(
                  "renderMechanism",
                  "component" as PortletRenderMechanism
                )
              }
              className={styles.radio}
            />
            Local React Component
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="renderMechanism"
              value="iframe"
              checked={payload.renderMechanism === "iframe"}
              onChange={() =>
                handleChange(
                  "renderMechanism",
                  "iframe" as PortletRenderMechanism
                )
              }
              className={styles.radio}
            />
            External URL (Iframe)
          </label>
        </div>
      </div>

      {/* Conditional URL Input with HelpTooltip */}
      {payload.renderMechanism === "iframe" && (
        <div className={styles.inputGroup}>
          <div className={styles.inputGroupHeader}>
            <label className={styles.label}>
              URL <span className={styles.required}>*</span>
            </label>
            <HelpTooltip>
              Enter the complete web address (URL) of the external application,
              dashboard, or content that this portlet should embed and display.
              Must start with `http://` or `https://`.
            </HelpTooltip>
          </div>
          <input
            type="url"
            value={payload.url || ""}
            onChange={(e) => handleChange("url", e.target.value)}
            className={styles.input}
            placeholder="https://example.com/portlet-app"
            required
          />
        </div>
      )}

      {/* Conditional Component Name Input with HelpTooltip */}
      {payload.renderMechanism === "component" && (
        <div className={styles.inputGroup}>
          <div className={styles.inputGroupHeader}>
            <label className={styles.label}>
              Component Name <span className={styles.required}>*</span>
            </label>
            <HelpTooltip>
              Provide the exact, case-sensitive name of the React component that
              corresponds to this portlet. This name must be pre-registered in
              your frontend's `PortletComponents.tsx` registry.
            </HelpTooltip>
          </div>
          <input
            type="text"
            value={payload.componentName || ""}
            onChange={(e) => handleChange("componentName", e.target.value)}
            className={styles.input}
            placeholder="e.g., SitePerformanceChart, UserList"
            required
          />
        </div>
      )}
    </>
  );
};

export default PortletRenderMechanismForm;
