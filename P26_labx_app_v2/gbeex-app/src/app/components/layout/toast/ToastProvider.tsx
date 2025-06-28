// src/app/components/toast/ToastProvider.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ToastContextType, ToastMessageType } from "./toast.types";
import ToastContainer from "./ToastContainer";
import { v4 as uuidv4 } from "uuid";

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const useToast = () => useContext(ToastContext)!;

interface Props {
  children: ReactNode;
}

export const ToastProvider = ({ children }: Props) => {
  const [toasts, setToasts] = useState<ToastMessageType[]>([]);

  const addToast = (toast: Omit<ToastMessageType, "id">) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};
