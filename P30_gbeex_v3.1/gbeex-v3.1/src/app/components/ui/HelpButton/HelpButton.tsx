import React, { useState, useRef, useEffect } from "react";
import Button from "@/app/components/ui/Buttons/Button";
import DropdownPanel from "@/app/components/ui/DropDownPanel/DropDownPanel";
import HelpDropdown from "@/app/components/ui/HelpButton/HelpDropDown";
import HelpIcon from "@/app/components/Icons/HelpIcon";
import styles from "@/app/components/ui/HelpButton/HelpButton.module.css";

const HelpButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles["help-button-container"]} ref={dropdownRef}>
      <Button variant="icon" aria-label="Help" onClick={toggleDropdown}>
        <HelpIcon />
      </Button>

      <DropdownPanel isOpen={isOpen}>
        <HelpDropdown />
      </DropdownPanel>
    </div>
  );
};

export default HelpButton;
