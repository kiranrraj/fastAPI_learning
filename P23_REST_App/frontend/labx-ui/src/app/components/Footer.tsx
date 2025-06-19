'use client'

import { useEffect, useState } from 'react'

const Footer = () => {
  const [time, setTime] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="w-full px-6 py-2 text-sm bg-white dark:bg-gray-900 text-right text-gray-600 dark:text-gray-300 border-t">
      <span className="mr-4">{time}</span>
      <span className="mr-4">UID: U12345</span>
      <span>Server: OK</span>
    </footer>
  )
}

export default Footer