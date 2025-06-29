// footerState.ts

import { FooterState, FooterStatus } from '@/app/types/footer/footer.types'

// Default values for FooterState
export const defaultFooterState: FooterState = {
    lastUpdated: null,
    version: 'v1.0.0',
    status: 'idle',
}

// set the last updated timestamp
export function setLastUpdated(state: FooterState, timestamp: string) {
    state.lastUpdated = timestamp
}

// set the app version
export function setVersion(state: FooterState, version: string) {
    state.version = version
}

// update status 
export function setStatus(state: FooterState, status: FooterStatus) {
    state.status = status
}
