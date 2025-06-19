// src/app/components/Footer/Footer.tsx

'use client'

import { useEffect, useState } from 'react'
import styles from './Footer.module.css'

const Footer = () => {
  const [time, setTime] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className={styles['footer-container']}>
      <span className={styles['footer-item']}>{time}</span>
      <span className={styles['footer-item']}>UID: U12345</span>
      <span className={styles['footer-item']}>Server: OK</span>
    </footer>
  )
}

export default Footer
