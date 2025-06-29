export type FooterStatus = 'idle' | 'loading' | 'success' | 'error' | 'offline'

export interface FooterState {
    lastUpdated: string | null    // ISO date string
    version: string               // 'v1.0.0'
    status: FooterStatus          // current app state
}
