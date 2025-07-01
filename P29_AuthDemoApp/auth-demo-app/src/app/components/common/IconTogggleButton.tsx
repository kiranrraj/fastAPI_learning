// src\app\components\common\IconTogggleButton.tsx

"use client";

import { useState } from "react";
import styles from "./IconToggleButton.module.css";

interface IconToggleButtonProps {
  onIcon: React.ReactNode; // Icon when toggle is ON (true)
  offIcon: React.ReactNode; // Icon when toggle is OFF (false)
  defaultState?: boolean; // Initial toggle state
  onToggle: (value: boolean) => void; // Callback to emit state change
  ariaLabel?: string; // Accessibility label
}

export default function IconToggleButton({
  onIcon,
  offIcon,
  defaultState = false,
  onToggle,
  ariaLabel = "Toggle button",
}: IconToggleButtonProps) {
  const [active, setActive] = useState(defaultState);

  const toggle = () => {
    const newState = !active;
    setActive(newState);
    onToggle(newState);
  };

  return (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={toggle}
      aria-pressed={active}
      aria-label={ariaLabel}
    >
      {active ? onIcon : offIcon}
    </button>
  );
}
