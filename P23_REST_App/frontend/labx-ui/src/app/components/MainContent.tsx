// src/app/components/MainContent/MainContent.tsx

'use client'

import { useState, useEffect } from 'react'
import TabPanel from '../components/TabPanel'
import { Tab } from '../types/tabTypes'
import styles from './MainContent.module.css'

interface MainContentProps {
  openTabs: Tab[]
  setOpenTabs: React.Dispatch<React.SetStateAction<Tab[]>>
}

const MainContent = ({ openTabs, setOpenTabs }: MainContentProps) => {
  const [activeTabId, setActiveTabId] = useState<string | null>(
    openTabs.length > 0 ? openTabs[0].id : null
  )

  // When tabs change, ensure focus stays
  useEffect(() => {
    // If current active tab was removed, next in the list will be made focused one
    if (activeTabId && !openTabs.find(t => t.id === activeTabId)) {
      setActiveTabId(openTabs.length > 0 ? openTabs[0].id : null)
    }

    // Focus will be added to the new opend tab
    if (openTabs.length > 0 && activeTabId !== openTabs[openTabs.length - 1].id) {
      setActiveTabId(openTabs[openTabs.length - 1].id)
    }
  }, [openTabs])

  const closeTab = (tabId: string) => {
    const index = openTabs.findIndex(t => t.id === tabId)
    const updated = openTabs.filter(t => t.id !== tabId)
    setOpenTabs(updated)

    // Focus handling code
    if (tabId === activeTabId) {
      if (updated.length > 0) {
        const nextTab = updated[index] || updated[updated.length - 1]
        setActiveTabId(nextTab.id)
      } else {
        setActiveTabId(null)
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* Tab Headers */}
      <div className={styles.tabHeader}>
        {openTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`${styles.tabButton} ${activeTabId === tab.id ? styles.active : ''}`}
          >
            <span className={styles.tabTitle}>{tab.title}</span>
            <span
              className={styles.closeButton}
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
            >
              ×
            </span>
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className={styles.tabBody}>
        {openTabs.length === 0 && (
          <div className={styles.emptyState}>No tabs open. Please select from the sidebar.</div>
        )}

        {openTabs.map((tab) =>
          tab.id === activeTabId ? <TabPanel key={tab.id} tab={tab} /> : null
        )}
      </div>
    </div>
  )
}

export default MainContent
