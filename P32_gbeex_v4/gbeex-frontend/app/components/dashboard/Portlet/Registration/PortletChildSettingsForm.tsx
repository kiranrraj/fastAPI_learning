// app/components/dashboard/Portlet/Registration/PortletChildSettingsForm.tsx
import React from "react";
import styles from "./PortletRegistrationForm.module.css";
import HelpTooltip from "@/app/components/common/HelpTooltip";
import type { PortletBase } from "@/app/types/portlet";

interface PortletChildSettingsFormProps {
  payload: PortletBase;
  handleChange: (k: keyof PortletBase, v: any) => void;
}

const PortletChildSettingsForm: React.FC<PortletChildSettingsFormProps> = ({
  payload,
  handleChange,
}) => {
  return (
    <>
      {/* Is Child Portlet Checkbox with HelpTooltip */}
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={payload.isChild}
            onChange={(e) => handleChange("isChild", e.target.checked)}
            className={styles.checkbox}
          />
          Is Child Portlet?
        </label>
        <HelpTooltip>
          Check this box if this portlet is intended to be a sub-component
          intended to be nested under a parent logical grouping. This affects
          how it appears in hierarchical navigation.
        </HelpTooltip>
      </div>

      {/* Conditional Parent Path Input with HelpTooltip */}
      {payload.isChild && (
        <div className={styles.inputGroup}>
          <div className={styles.inputGroupHeader}>
            <label className={styles.label}>
              Parent Path <span className={styles.required}>*</span>
            </label>
            <HelpTooltip>
              Define the full hierarchical path (e.g.,
              `Dashboard/Reports/Detailed`) where this child portlet belongs
              within the portal's content structure. Use slashes to denote
              levels.
            </HelpTooltip>
          </div>
          <input
            type="text"
            value={payload.parentPath || ""}
            onChange={(e) => handleChange("parentPath", e.target.value)}
            className={styles.input}
            placeholder="e.g., Dashboard/Reports (use slashes for hierarchy)"
            required
          />
        </div>
      )}
    </>
  );
};

export default PortletChildSettingsForm;
