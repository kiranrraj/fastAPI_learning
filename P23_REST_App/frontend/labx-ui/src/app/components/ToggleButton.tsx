// src/app/components/ToggleButton.tsx
'use client'

import React from 'react'
import styles from './ToggleButton.module.css'

interface ToggleButtonProps {
  enabled: boolean
  onToggle: () => void
}

const ToggleButton = ({ enabled, onToggle }: ToggleButtonProps) => (
  <button onClick={onToggle} className={styles.toggle}>
    <div className={`${styles.circle} ${enabled ? styles.enabled : ''}`} />
  </button>
)

export default ToggleButton
