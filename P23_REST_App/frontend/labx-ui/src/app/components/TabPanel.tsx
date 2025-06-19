// src/app/components/TabPanel/TabPanel.tsx

import React from 'react'
import { Tab } from '../types/tabTypes'
import styles from './TabPanel.module.css'

interface TabPanelProps {
  tab: Tab
}

const TabPanel = ({ tab }: TabPanelProps) => {
  if (tab.type === 'investigation') {
    // Investigation tab shows single record as formatted JSON
    return (
      <div className={styles.panel}>
        <h2 className={styles.heading}>{tab.title}</h2>
        <pre className={styles.jsonBlock}>
          {JSON.stringify(tab.content, null, 2)}
        </pre>
      </div>
    )
  }

  if (tab.type === 'group') {
    // Group tab shows multiple investigation cards
    const investigations = tab.content || []

    return (
      <div className={styles.panel}>
        <h2 className={styles.heading}>{tab.title}</h2>
        <div className={styles.cardContainer}>
          {investigations.length > 0 ? (
            investigations.map((inv: any) => (
              <div key={inv.investigation_id} className={styles.card}>
                <h3 className={styles.cardTitle}>{inv.name}</h3>
                <div className={styles.cardDetails}>
                  <pre>{JSON.stringify(inv, null, 2)}</pre>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noData}>No investigations found.</p>
          )}
        </div>
      </div>
    )
  }

  return <div className={styles.panel}>Unsupported tab type</div>
}

export default TabPanel
