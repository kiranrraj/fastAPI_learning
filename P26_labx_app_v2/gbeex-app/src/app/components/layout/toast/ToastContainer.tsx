// src/app/components/toast/ToastContainer.tsx
"use client";

import { useContext } from "react";
import { ToastContext } from "./ToastProvider";
import ToastMessage from "./ToastMessage";
import styles from "./ToastContainer.module.css";

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useContext(ToastContext)!;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} {...toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
