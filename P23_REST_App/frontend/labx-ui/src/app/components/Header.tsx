'use client'

import React, { useState } from 'react'
import ToggleButton from './ToggleButton'
import DropdownMenu from './DropdownMenu'
import styles from './Header.module.css'

interface HeaderProps {
  toggleSidebar?: () => void
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [darkMode, setDarkMode] = useState(false)
  const avatarUrl = "/avatar_default_1.svg"
  const profileName = 'Kiranraj R.'
  const logoUrl = "/logo.jpg"
  
  // const toggleTheme = () => {
  //   setDarkMode(!darkMode)
  //   if (!darkMode) {
  //     document.body.classList.add('dark')
  //   } else {
  //     document.body.classList.remove('dark')
  //   }
  // }

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode);
  }


  const handleLogout = () => {
    console.log('Logging out...')
  }

  return (
    <header className={styles.container}>
      {/* Left: Sidebar Toggle + Logo */}
      <div className={styles.left}>
        {toggleSidebar && (
          <button className={styles.toggleSidebar} onClick={toggleSidebar}>
            ☰
          </button>
        )}


        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className={styles.logo} />
        ) : (
          <div className={styles.logoPlaceholder}>Logo</div>
        )}

        <span className={styles.title}>LabX</span>
      </div>

      {/* Right: Profile, Settings, Toggle, Logout */}
      <div className={styles.right}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>Avatar</div>
        )}

        <span className={styles.profileName}>{profileName}</span>

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

        <ToggleButton enabled={darkMode} onToggle={toggleTheme} />

        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
