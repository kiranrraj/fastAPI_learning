// notificationState.ts

import { AppShellState } from '@/app/types/appShellState.types'
import {
    Notification,
    NotificationState,
} from '@/app/types/notification/notification.types'

// Default state
export const defaultNotificationState: NotificationState = {
    notifications: [],
}

// Add a new notification
export function addNotification(state: AppShellState, notification: Notification) {
    state.notification.notifications.unshift(notification)
}

// Mark one as read
export function markAsRead(state: AppShellState, notificationId: string) {
    const target = state.notification.notifications.find(
        (n: Notification) => n.id === notificationId
    )
    if (target) target.read = true
}

// Remove one by ID
export function removeNotification(state: AppShellState, notificationId: string) {
    state.notification.notifications = state.notification.notifications.filter(
        (n: Notification) => n.id !== notificationId
    )
}

// Clear all
export function clearAllNotifications(state: AppShellState) {
    state.notification.notifications = []
}
