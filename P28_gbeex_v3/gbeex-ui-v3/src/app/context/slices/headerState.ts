// headerState.ts

import { HeaderState } from '@/app/types/header/header.types'

// Default state values
export const defaultHeaderState: HeaderState = {
    showNotifications: false,
    theme: 'light',
    language: 'en',
}

// Mutation: toggle light/dark theme
export function toggleTheme(state: HeaderState) {
    state.theme = state.theme === 'light' ? 'dark' : 'light'
}

// Mutation: explicitly set theme
export function setTheme(state: HeaderState, theme: 'light' | 'dark') {
    state.theme = theme
}

// Mutation: toggle notification panel
export function toggleNotifications(state: HeaderState) {
    state.showNotifications = !state.showNotifications
}

// Mutation: set a language (e.g., 'en', 'fr', 'de')
export function setLanguage(state: HeaderState, language: string) {
    state.language = language
}
