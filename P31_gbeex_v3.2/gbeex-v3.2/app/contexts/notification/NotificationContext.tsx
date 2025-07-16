"use client";

import { createContext } from "react";
import { Notification } from "@/app/types";

// 1. Define the "shape" of the context's value
export type NotificationContextType = {
  notifications: Notification[];
  handleDeleteNotification: (id: number) => void;
  handleClearAllNotifications: () => void;
};

// 2. Create the context with a default value of null
// Components will use this to subscribe to notification data
export const NotificationContext =
  createContext<NotificationContextType | null>(null);
