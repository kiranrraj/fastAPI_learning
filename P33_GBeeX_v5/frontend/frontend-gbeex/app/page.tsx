"use client";

import React, { useState } from "react";
import GenericSearchPortlet from "./GenericSearchPortlet";
import styles from "./page.module.css";

export default function DashboardPage() {
  const [entity, setEntity] = useState<
    "company" | "protocol" | "site" | "subject"
  >("company");

  const initialFilters = {};

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>GBeeX Dashboard</h1>
        </div>
      </header>

      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Select Entity:</h3>
            <div className={styles.radioForm}>
              {(["company", "protocol", "site", "subject"] as const).map(
                (e) => (
                  <label key={e} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="entity"
                      value={e}
                      checked={entity === e}
                      onChange={() => setEntity(e)}
                      className={styles.radioInput}
                    />
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </label>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.mainContent}>
          <section className={styles.portletSection}>
            <h2 className={styles.portletSectionTitle}>
              {entity.charAt(0).toUpperCase() + entity.slice(1)} Search
            </h2>
            <GenericSearchPortlet
              key={entity}
              entity={entity}
              initialFilters={initialFilters}
            />
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <small>© 2025 GBeeX</small>
        </div>
      </footer>
    </div>
  );
}
