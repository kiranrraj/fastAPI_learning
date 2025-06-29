export type Theme = 'light' | 'dark'

export interface HeaderState {
    showNotifications: boolean
    theme: Theme
    language: string
}
