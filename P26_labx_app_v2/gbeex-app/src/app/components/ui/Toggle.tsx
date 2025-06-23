"use client";

import React from "react";
import styles from "./Toggle.module.css";

/**
 * Component: Toggle
 * -----------------
 * A flexible toggle button for any binary state.
 *
 * INPUT PROPS:
 * - isActive: boolean - current toggle state
 * - onToggle: () => void - function to toggle state
 * - label?: string - optional ARIA label
 * - activeContent?: React.ReactNode - content for active state
 * - inactiveContent?: React.ReactNode - content for inactive state
 * - tooltip?: string - optional hover tooltip
 * - className?: string - optional external class styling
 *
 * OUTPUT:
 * - Renders a button that switches content based on `isActive`
 */

interface ToggleProps {
  isActive: boolean;
  onToggle: () => void;
  label?: string;
  activeContent?: React.ReactNode;
  inactiveContent?: React.ReactNode;
  tooltip?: string;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  isActive,
  onToggle,
  label,
  activeContent = "✓",
  inactiveContent = "✗",
  tooltip,
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      aria-label={label}
      title={tooltip}
      className={`${styles.toggle} ${className}`}
    >
      {isActive ? activeContent : inactiveContent}
    </button>
  );
};

export default Toggle;
