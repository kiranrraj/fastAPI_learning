import React, { useEffect } from "react";
import styles from "./AlertPopup.module.css";

interface AlertPopupProps {
  message: string | React.ReactNode;
  type?: "info" | "warning" | "error" | "success" | "custom";
  duration?: number; // auto-close after N ms
  persistent?: boolean; // prevent auto-close
  onClose?: () => void;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "top-right" | "bottom-right";
  showCloseButton?: boolean;
}

const AlertPopup: React.FC<AlertPopupProps> = ({
  message,
  type = "info",
  duration = 3000,
  persistent = false,
  onClose,
  icon,
  actions,
  className = "",
  position = "top",
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (!persistent && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [persistent, onClose, duration]);

  const positionClass = styles[`position_${position}`] || "";

  return (
    <div
      className={`${styles.popup} ${styles[type]} ${positionClass} ${className}`}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.message}>{message}</div>
      {actions && <div className={styles.actions}>{actions}</div>}
      {showCloseButton && onClose && (
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default AlertPopup;
