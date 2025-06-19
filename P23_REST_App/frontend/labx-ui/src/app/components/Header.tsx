// src/app/components/Header.tsx
'use client'

import React, { useEffect, useState } from 'react'
import ToggleButton from './ToggleButton'
import DropdownMenu from './DropdownMenu'
import styles from './Header.module.css'

const Header = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://randomuser.me/api/')
      .then((res) => res.json())
      .then((data) => {
        setAvatarUrl(data.results[0].picture.thumbnail)
      })
      .catch(console.error)
  }, [])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('dark', !darkMode)
  }

  return (
    <header className={styles.container}>
      {/* Logo and Title */}
      <div className={styles.left}>
        <span className={styles.logo}>🧪</span>
        <span className={styles.title}>LabX</span>
      </div>

      {/* Controls on right */}
      <div className={styles.right}>
        <ToggleButton enabled={darkMode} onToggle={toggleTheme} />

        <DropdownMenu
          trigger={
            <span className={styles.iconButton} title="Settings">
              ⚙️
            </span>
          }
        >
          <ul className={styles.dropdownList}>
            <li className={styles.dropdownItem}>Profile</li>
            <li className={styles.dropdownItem}>Settings</li>
            <li className={styles.dropdownItem}>Logout</li>
          </ul>
        </DropdownMenu>

        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>👤</div>
        )}
      </div>
    </header>
  )
}

export default Header
