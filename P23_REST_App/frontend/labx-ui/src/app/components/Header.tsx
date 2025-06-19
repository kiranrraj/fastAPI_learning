'use client'

import { useState } from 'react'

const Header = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => setDarkMode(!darkMode)

  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-900 shadow px-6 py-3">
      {/* Left: Logo + App Name */}
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="LabX Logo" className="h-8 w-8" />
        <span className="text-xl font-semibold">LabX</span>
      </div>

      {/* Right: Profile + Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Placeholder */}
        <button onClick={toggleTheme} className="text-lg hover:text-primary">
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img src="/profile.jpg" alt="User" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium">Dr. Ashwin</span>

          {/* Settings Dropdown */}
          <div className="relative group">
            <span className="cursor-pointer text-lg">⚙️</span>
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded shadow-md hidden group-hover:block z-50">
              <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Settings</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                  🚪 Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
