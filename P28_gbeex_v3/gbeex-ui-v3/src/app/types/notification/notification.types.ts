// notification.types.ts

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
    id: string                // unique identifier (e.g., UUID or timestamp)
    title: string             // short title (e.g., "Sync Complete")
    message: string           // detailed message
    type: NotificationType    // category (info/success/etc.)
    read: boolean             // whether the user has read it
    timestamp: string         // ISO string
}

export interface NotificationState {
    notifications: Notification[]
}
