// src\app\hooks\useToast.ts


import { useContext } from "react";
import { ToastContext } from "@/app/components/toats/ToastProvider";

export default function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within <ToastProvider>");
    return context;
}
