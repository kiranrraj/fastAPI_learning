'use client'

import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MainContent from './MainContent'
import { Tab } from '../types/tabTypes'
import styles from './MainLayout.module.css'

const MainLayout = () => {
  const [openTabs, setOpenTabs] = useState<Tab[]>([])
  const [sidebarVisible, setSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev)
  }

  return (
    <div className={styles.layoutContainer}>
      <Header toggleSidebar={toggleSidebar} />
      <div className={styles.layoutMain}>
        <Sidebar
          openTabs={openTabs}
          setOpenTabs={setOpenTabs}
          collapsed={!sidebarVisible}
        />
        <main
          className={`${styles.layoutContent} ${
            sidebarVisible ? styles.withSidebar : styles.fullWidth
          }`}
        >
          <MainContent openTabs={openTabs} setOpenTabs={setOpenTabs} />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
