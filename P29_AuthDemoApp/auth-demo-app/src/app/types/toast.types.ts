// src\app\types\toast.types.ts

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface Toast {
    id: string;
    message: string;
    type?: "success" | "error" | "info" | "warning";
    duration?: number;
    position?: ToastPosition;
}

export interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}
