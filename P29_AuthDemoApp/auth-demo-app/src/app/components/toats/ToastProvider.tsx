// src\app\components\toats\ToastProvider.tsx

"use client";

import { createContext, useContext, useState, useRef } from "react";
import { Toast, ToastContextType } from "@/app/types/toast.types";
import ToastContainer from "./ToastContainer";
import { v4 as uuidv4 } from "uuid";

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({
  children,
  position = "top-right",
}: {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const queueRef = useRef<Toast[]>([]);
  const MAX_TOASTS = 3;

  const addToast = (toast: Omit<Toast, "id">) => {
    const newToast = { ...toast, id: uuidv4() };
    setToasts((prev) => {
      if (prev.length < MAX_TOASTS) {
        return [...prev, newToast];
      } else {
        queueRef.current.push(newToast);
        return prev;
      }
    });

    if (toast.duration !== 0) {
      setTimeout(() => removeToast(newToast.id), toast.duration ?? 4000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      if (queueRef.current.length > 0) {
        const next = queueRef.current.shift();
        if (next) updated.push(next);
      }
      return updated;
    });
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
        position={position}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
};
