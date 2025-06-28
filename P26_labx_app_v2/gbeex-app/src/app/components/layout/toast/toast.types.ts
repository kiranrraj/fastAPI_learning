// src/app/components/toast/toast.types.ts

export type ToastStatus = "success" | "error" | "info" | "warning";

export interface ToastMessageType {
    id: string;
    message: string;
    status?: ToastStatus;
    duration?: number; // milliseconds
}

export interface ToastContextType {
    toasts: ToastMessageType[];
    addToast: (toast: Omit<ToastMessageType, "id">) => void;
    removeToast: (id: string) => void;
}
