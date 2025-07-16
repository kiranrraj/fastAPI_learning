"use client";

import React, { useState, ReactNode } from "react";
import {
  NotificationContext,
  NotificationContextType,
} from "./NotificationContext";
import { Notification } from "@/app/types";

// This component will provide the notification data to its children
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  // State for holding the list of notifications, initialized with some dummy data
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "New subject 'SUBJ-001' added to Protocol X." },
    { id: 2, message: "Site 'USA-EAST-01' has been activated." },
    { id: 3, message: "Your weekly report is ready for review." },
  ]);

  // Function to delete a single notification from the list
  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Function to clear all notifications
  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // The value object contains the state and the functions to modify it.
  // This is what will be available to all consuming components.
  const value: NotificationContextType = {
    notifications,
    handleDeleteNotification,
    handleClearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
