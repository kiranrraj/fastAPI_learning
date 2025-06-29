// userState.ts

import { AppShellState } from '@/app/types/appShellState.types'
import { User, UserState } from '@/app/types/user/user.types'

//  Default user state
export const defaultUserState: UserState = {
    session: null,
}

//  Set user session 
export function setUser(state: AppShellState, user: User) {
    state.userState.session = { user }
}

//  Clear user session 
export function clearUser(state: AppShellState) {
    state.userState.session = null
}

//  Update user preferences 
export function updatePreferences(state: AppShellState, preferences: string[]) {
    if (state.userState.session) {
        state.userState.session.user.preferences = preferences
    }
}

//  Update user's allowed content 
export function setAllowedContent(state: AppShellState, contentIds: string[]) {
    if (state.userState.session) {
        state.userState.session.user.allowedContent = contentIds
    }
}

//  Optional: Replace entire user object 
export function replaceUser(state: AppShellState, user: User) {
    state.userState.session = { user }
}
