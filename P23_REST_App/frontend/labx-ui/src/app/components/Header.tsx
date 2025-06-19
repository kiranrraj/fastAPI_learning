'use client'

import React, { useState } from 'react'
import ToggleButton from './ToggleButton'
import DropdownMenu from './DropdownMenu'
import styles from './Header.module.css'

const Header = () => {
  const [darkMode, setDarkMode] = useState(false)
  const avatarUrl = "/avatar_default_1.svg"
  const profileName = 'Kiranraj R.' 
  const logoUrl = "/logo.jpg"

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('dark', !darkMode)
  }

  const handleLogout = () => {
    console.log('Logging out...')
  }

  return (
    <header className={styles.container}>
      {/* Left: Logo & Title */}
      <div className={styles.left}>
        {/* Profile Image */}
        {avatarUrl ? (
          <img src={logoUrl} alt="Profile" className={styles.logo} />
        ) : (
          <div className={styles.logoPlaceholder}>Avatar</div>
        )}
        <span className={styles.title}>LabX</span>
      </div>

      {/* Right: Profile, Settings, Toggle, Logout */}
      <div className={styles.right}>
        {/* Profile Image */}
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>Avatar</div>
        )}

        {/* Profile Name */}
        <span className={styles.profileName}>{profileName}</span>

        {/* Settings Dropdown */}
        <DropdownMenu
          trigger={
            <span className={styles.iconButton} title="Settings">
              ⚙️
            </span>
          }
        >
          <ul className={styles.dropdownList}>
            <li className={styles.dropdownItem}>Account</li>
            <li className={styles.dropdownItem}>Preferences</li>
          </ul>
        </DropdownMenu>

        {/* Dark Mode Toggle */}
        <ToggleButton enabled={darkMode} onToggle={toggleTheme} />

        {/* Logout Button */}
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
