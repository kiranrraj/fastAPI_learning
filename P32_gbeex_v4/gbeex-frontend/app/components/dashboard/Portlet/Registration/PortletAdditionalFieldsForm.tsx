// app/components/dashboard/Portlet/Registration/PortletAdditionalFieldsForm.tsx
import React from "react";
import styles from "./PortletRegistrationForm.module.css";
import HelpTooltip from "@/app/components/common/HelpTooltip";
import type { PortletBase } from "@/app/types/portlet";

interface PortletAdditionalFieldsFormProps {
  payload: PortletBase;
  handleChange: (k: keyof PortletBase, v: any) => void;
  settingsText: string;
  handleSettings: (txt: string) => void;
  messageType: "success" | "error" | "";
  message: string;
  showLongDescriptionField: boolean;
  setShowLongDescriptionField: (show: boolean) => void;
  showTestNotesField: boolean;
  setShowTestNotesField: (show: boolean) => void;
  showSettingsField: boolean;
  setShowSettingsField: (show: boolean) => void;
}

const PortletAdditionalFieldsForm: React.FC<
  PortletAdditionalFieldsFormProps
> = ({
  payload,
  handleChange,
  settingsText,
  handleSettings,
  messageType,
  message,
  showLongDescriptionField,
  setShowLongDescriptionField,
  showTestNotesField,
  setShowTestNotesField,
  showSettingsField,
  setShowSettingsField,
}) => {
  return (
    <>
      {/* Add Long Description Checkbox with HelpTooltip */}
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showLongDescriptionField}
            onChange={(e) => {
              setShowLongDescriptionField(e.target.checked);
              if (!e.target.checked) handleChange("longDescription", undefined);
            }}
            className={styles.checkbox}
          />
          Add Long Description
        </label>
        <HelpTooltip>
          Enable this option to provide a more detailed, comprehensive
          explanation of the portlet's features, purpose, usage guidelines, or
          technical implementation notes. This is ideal for internal
          documentation or advanced user reference.
        </HelpTooltip>
      </div>

      {/* Conditional Long Description Textarea */}
      {showLongDescriptionField && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Long Description</label>
          <textarea
            value={payload.longDescription || ""}
            onChange={(e) => handleChange("longDescription", e.target.value)}
            rows={4}
            className={styles.textarea}
            placeholder="Provide a more detailed explanation of the portlet."
          />
        </div>
      )}

      {/* Add Test Notes Checkbox with HelpTooltip */}
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showTestNotesField}
            onChange={(e) => {
              setShowTestNotesField(e.target.checked);
              if (!e.target.checked) handleChange("testNotes", undefined);
            }}
            className={styles.checkbox}
          />
          Add Test Notes
        </label>
        <HelpTooltip>
          Check this to include notes or specific test cases related to this
          portlet's development, functionality validation, or any known issues.
          This is useful for quality assurance and ongoing maintenance.
        </HelpTooltip>
      </div>

      {showTestNotesField && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Test Notes</label>
          <textarea
            value={payload.testNotes || ""}
            onChange={(e) => handleChange("testNotes", e.target.value)}
            rows={4}
            className={styles.textarea}
            placeholder="Any specific test cases, considerations, or notes for this portlet."
          />
        </div>
      )}

      {/* Add Settings Checkbox with HelpTooltip */}
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showSettingsField}
            onChange={(e) => {
              setShowSettingsField(e.target.checked);
              if (!e.target.checked) {
                handleChange("settings", {});
                handleSettings("{}"); // Reset settings text
                // Clear messages related to settings JSON
                if (messageType === "error" && message.includes("JSON")) {
                  // Assuming message is managed by parent
                }
              }
            }}
            className={styles.checkbox}
          />
          Add Settings (JSON)
        </label>
        <HelpTooltip>
          Enable this to provide custom configuration data for the portlet in
          JSON format. This arbitrary data will be passed as
          `portletData.settings` to the rendering component for dynamic behavior
          (e.g., API endpoints, default filters, chart types).
        </HelpTooltip>
      </div>

      {showSettingsField && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Settings (JSON)</label>
          <textarea
            value={settingsText}
            onChange={(e) => handleSettings(e.target.value)}
            rows={6}
            className={`${styles.textarea} ${
              messageType === "error" && message.includes("JSON")
                ? styles.inputError
                : ""
            }`}
            placeholder='{"apiKey": "your_api_key", "defaultView": "chart", "refreshInterval": 300}'
          />
          {messageType === "error" && message.includes("JSON") && (
            <p className={styles.errorMessage}>{message}</p>
          )}
        </div>
      )}
    </>
  );
};

export default PortletAdditionalFieldsForm;
