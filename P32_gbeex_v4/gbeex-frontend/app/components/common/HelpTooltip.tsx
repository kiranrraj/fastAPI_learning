// app/components/dashboard/Portlet/Registration/HelpTooltip.tsx
import React, { useState, useRef, ReactNode } from "react";
import InfoIcon from "@/app/components/icons/InfoIcon";
import styles from "./HelpTooltip.module.css";

interface HelpTooltipProps {
  children: ReactNode;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible((prev) => !prev);
  };

  return (
    <div className={styles.helpTooltipContainer}>
      <span
        className={styles.infoIconWrapper}
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={toggle}
        role="button"
        aria-label={isVisible ? "Hide help" : "Show help"}
        aria-expanded={isVisible}
      >
        <InfoIcon className={styles.infoIcon} />
      </span>
      {isVisible && (
        <div
          className={`${styles.helpTooltipContent} ${styles.helpTooltipContentVisible}`}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
