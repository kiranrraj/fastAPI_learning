// src/types/notification.types.ts

/**
 * Represents the basic structure for a single notification object.
 * This is a shared type used across multiple components.
 */
export interface Notification {
    id: string | number;
    title: string;
    description: string;
}

/**
 * Defines the props for the NotificationItem component.
 * It expects a single notification object and a function to handle its dismissal.
 */
export interface NotificationItemProps {
    notification: Notification;
    onDismiss: (id: string | number) => void;
}

/**
 * Defines the props for the NotificationDropdown component.
 * It requires the list of notifications and handler functions for various actions.
 */
export interface NotificationDropdownProps {
    notifications: Notification[];
    onDismiss: (id: string | number) => void;
    onClearAll: () => void;
    onReadMore: () => void;
}
