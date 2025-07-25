// app/components/dashboard/Portlet/Registration/PortletBasicDetailsForm.tsx
import React from "react";
import styles from "./PortletRegistrationForm.module.css";
import HelpTooltip from "@/app/components/common/HelpTooltip";
import type { PortletBase, PortletCategory } from "@/app/types/portlet";

interface PortletBasicDetailsFormProps {
  payload: PortletBase;
  handleChange: (k: keyof PortletBase, v: any) => void;
  autoGeneratedKey: string;
  portletsLength: number; // To help with order initialization
}

const PortletBasicDetailsForm: React.FC<PortletBasicDetailsFormProps> = ({
  payload,
  handleChange,
  autoGeneratedKey,
  portletsLength,
}) => {
  return (
    <>
      {/* Portlet Key Input with HelpTooltip */}
      <div className={styles.inputGroup}>
        <div className={styles.inputGroupHeader}>
          <label className={styles.label}>
            Portlet Key <span className={styles.required}>*</span>
          </label>
          <HelpTooltip>
            A unique, programmatic identifier for this portlet (e.g.,
            `user-profile-summary`). This key is used for internal lookups and
            URL segments. If left blank, a unique key will be automatically
            generated based on the title and category.
          </HelpTooltip>
        </div>
        <input
          type="text"
          value={payload.key}
          onChange={(e) => handleChange("key", e.target.value)}
          className={styles.input}
          placeholder={autoGeneratedKey}
          required
        />
      </div>

      {/* Title Input with HelpTooltip */}
      <div className={styles.inputGroup}>
        <div className={styles.inputGroupHeader}>
          <label className={styles.label}>
            Title <span className={styles.required}>*</span>
          </label>
          <HelpTooltip>
            The human-readable display name for this portlet (e.g., "User
            Profile Summary Card"). This title will be visible in the sidebar
            and as the tab name in the content area.
          </HelpTooltip>
        </div>
        <input
          type="text"
          value={payload.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={styles.input}
          required
        />
      </div>

      {/* Category Input with HelpTooltip */}
      <div className={styles.inputGroup}>
        <div className={styles.inputGroupHeader}>
          <label className={styles.label}>
            Category <span className={styles.required}>*</span>
          </label>
          <HelpTooltip>
            Assign a category to help organize and filter portlets within the
            portal. This helps users quickly find relevant content based on
            their functional area.
          </HelpTooltip>
        </div>
        <select
          value={payload.category}
          onChange={(e) =>
            handleChange("category", e.target.value as PortletCategory)
          }
          className={styles.select}
          required
        >
          <option value="analytics">Analytics</option>
          <option value="visualization">Visualization</option>
          <option value="generic">Generic</option>
          <option value="report">Report</option>
          <option value="workflow">Workflow</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Description Input with HelpTooltip */}
      <div className={styles.inputGroup}>
        <div className={styles.inputGroupHeader}>
          <label className={styles.label}>
            Description <span className={styles.required}>*</span>
          </label>
          <HelpTooltip>
            A brief, concise summary of the portlet's main purpose or content.
            This description might appear in tooltips, search results, or quick
            summaries.
          </HelpTooltip>
        </div>
        <input
          type="text"
          value={payload.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={styles.input}
          required
        />
      </div>

      {/* Enabled Checkbox with HelpTooltip */}
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={payload.enabled}
            onChange={(e) => handleChange("enabled", e.target.checked)}
            className={styles.checkbox}
          />
          Enabled
        </label>
        <HelpTooltip>
          Controls whether this portlet is currently active and visible to users
          in the portal. Uncheck this option to temporarily hide the portlet
          without deleting its configuration.
        </HelpTooltip>
      </div>

      {/* Order Input with HelpTooltip */}
      <div className={styles.inputGroup}>
        <div className={styles.inputGroupHeader}>
          <label className={styles.label}>
            Order <span className={styles.required}>*</span>
          </label>
          <HelpTooltip>
            Defines the display priority of the portlet within its category or
            list. Portlets with lower numbers (e.g., 1, 2) will appear before
            those with higher numbers.
          </HelpTooltip>
        </div>
        <input
          type="number"
          value={payload.order}
          onChange={(e) =>
            handleChange("order", parseInt(e.target.value, 10) || 0)
          }
          className={styles.input}
          required
        />
      </div>
    </>
  );
};

export default PortletBasicDetailsForm;
