// src\app\types\notification.types.ts

export interface Notification {
    id: string;
    message: string;  // Notification Message
    read: boolean;    // Notification read or not
    timestamp?: string;
    type?: 'info' | 'warning' | 'error' | 'success'; // Optional type for styling
}
