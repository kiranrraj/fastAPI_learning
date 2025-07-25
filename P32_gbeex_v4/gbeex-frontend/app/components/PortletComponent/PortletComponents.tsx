// app/components/PortletComponents.tsx
import React from "react";
import type { Portlet } from "@/app/types/portlet";
import DataExplorerPortlet from "@/app/components/dashboard/Portlet/DataExplorerPortlet";
import styles from "./PortletComponents.module.css";
import SimpleSubjectSearch from "../dashboard/Portlet/simpleSubjectSearch/SimpleSubjectSearch";
import SimpleSearch from "../dashboard/Portlet/simpleSearch/SimpleSearch";

// Define a type for common props passed to dynamic components
interface PortletComponentProps {
  // The full portlet data from the DB, including settings
  portletData: Portlet;
}

// This interface defines the expected shape of our component registry
interface ComponentRegistry {
  [key: string]: React.ComponentType<PortletComponentProps>;
}

export const PortletComponents: ComponentRegistry = {
  // Register the DataExplorerPortlet component
  DataExplorerPortlet: DataExplorerPortlet,
  SimpleSubjectSearch: SimpleSubjectSearch,
  SimpleSearch: SimpleSearch,
  // Other components will be added here later
  // once their files are created.
};

const UnknownComponent: React.FC<PortletComponentProps> = ({ portletData }) => (
  <div className={styles.unknownComponentContainer}>
    <h3 className={styles.unknownComponentTitle}>
      Error: Unknown Portlet Component
    </h3>
    <p className={styles.unknownComponentText}>
      The component name configured for this portlet was not found.
    </p>
    <p className={styles.unknownComponentText}>
      <strong>Configured Component:</strong>{" "}
      <code className={styles.unknownComponentCode}>
        {portletData.componentName || "N/A"}
      </code>
    </p>
    <p className={styles.unknownComponentHelp}>
      Please check the `componentName` in the portlet's settings in the database
      or registration form.
    </p>
    <details className={styles.unknownComponentDetails}>
      <summary className={styles.unknownComponentSummary}>
        View Raw Portlet Data
      </summary>
      <pre className={styles.unknownComponentPre}>
        {JSON.stringify(portletData, null, 2)}
      </pre>
    </details>
  </div>
);

export const getPortletComponent = (componentName: string | undefined) => {
  if (!componentName || !PortletComponents[componentName]) {
    console.warn(
      `[PortletComponents] Attempted to load unknown portlet component: "${componentName}"`
    );
    // Return a fallback component
    return UnknownComponent;
  }
  return PortletComponents[componentName];
};
