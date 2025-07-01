// src\app\components\toats\ToastContainer.tsx

"use client";

import styles from "./ToastContainer.module.css";
import ToastMessage from "./ToastMessage";
import { Toast } from "@/app/types/toast.types";

interface Props {
  toasts: Toast[];
  onRemove: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export default function ToastContainer({
  toasts,
  onRemove,
  position = "top-right",
}: Props) {
  const positionClass = styles[position] || styles["top-right"];

  return (
    <div className={`${styles.toastWrapper} ${positionClass}`}>
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
