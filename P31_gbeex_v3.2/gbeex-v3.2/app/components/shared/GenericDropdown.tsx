"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import styles from "./GenericDropdown.module.css";

interface GenericDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  width?: number;
}

export default function GenericDropdown({
  trigger,
  children,
  width = 260,
}: GenericDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // This effect handles closing the dropdown when a click occurs outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add the event listener when the dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener when the component unmounts or the dropdown closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* The trigger element is wrapped to attach the onClick handler */}
      <div onClick={handleTriggerClick}>{trigger}</div>

      {isOpen && (
        <div className={styles.dropdown} style={{ width: `${width}px` }}>
          {children}
        </div>
      )}
    </div>
  );
}
