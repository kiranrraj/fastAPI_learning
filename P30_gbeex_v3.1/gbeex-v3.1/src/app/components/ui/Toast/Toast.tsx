"use client";
import React, { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export const Toast = ({ message, onDismiss }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000); // Auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={styles.toast}>
      <AlertCircle className="alert-icon" />
      <span>{message}</span>
    </div>
  );
};
