// src/app/components/DropdownMenu.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './DropdownMenu.module.css'

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
}

const DropdownMenu = ({ trigger, children }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className={styles.container} ref={ref}>
      <div onClick={() => setOpen(!open)} className={styles.trigger}>
        {trigger}
      </div>
      {open && <div className={styles.menu}>{children}</div>}
    </div>
  )
}

export default DropdownMenu
