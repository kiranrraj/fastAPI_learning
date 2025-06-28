// src/app/components/toast/ToastMessage.tsx
"use client";

import { useEffect } from "react";
import styles from "./ToastMessage.module.css";
import { ToastMessageType } from "./toast.types";

interface ToastMessageProps extends ToastMessageType {
  onRemove: (id: string) => void;
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  id,
  message,
  status = "info",
  duration = 3000,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <div className={`${styles.toast} ${styles[status]}`}>
      <span>{message}</span>
    </div>
  );
};

export default ToastMessage;
