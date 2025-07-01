// src\app\components\toats\ToastMessage.tsx

"use client";

import styles from "./ToastMessage.module.css";
import { Toast } from "@/app/types/toast.types";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { JSX } from "react";

export default function ToastMessage({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const iconMap: Record<NonNullable<Toast["type"]>, JSX.Element> = {
    success: <CheckCircle size={18} />,
    error: <AlertTriangle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
  };

  const type = toast.type ?? "info"; // fallback in case undefined

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.icon}>{iconMap[type]}</div>
      <div className={styles.message}>{toast.message}</div>
      <button className={styles.closeButton} onClick={() => onRemove(toast.id)}>
        <X size={16} />
      </button>
    </div>
  );
}
