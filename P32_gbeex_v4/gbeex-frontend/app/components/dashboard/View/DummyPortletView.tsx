// app/components/dashboard/View/DummyPortletView.tsx
"use client";

import React from "react";
import styles from "./DummyPortletView.module.css";

interface DummyPortletViewProps {
  title: string;
  settings: Record<string, any>;
}

export default function DummyPortletView({
  title,
  settings,
}: DummyPortletViewProps) {
  // Default data if settings is empty
  const defaults = {
    message: "No configuration provided for this portlet.",
    timestamp: new Date().toLocaleString(),
    note: "This is a dummy view. Actual portlet content would be rendered here based on its key and settings.",
  };
  const finalSettings =
    settings && Object.keys(settings).length > 0 ? settings : defaults;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>
        Displaying settings for this portlet.
      </p>
      <pre className={styles.settings}>
        {JSON.stringify(finalSettings, null, 2)}
      </pre>
      <div className={styles.infoBox}>
        <p>
          This is a placeholder view. In a real application, this component
          would dynamically render the actual content of the portlet based on
          its `key` and `settings` from the backend.
        </p>
      </div>
    </div>
  );
}
