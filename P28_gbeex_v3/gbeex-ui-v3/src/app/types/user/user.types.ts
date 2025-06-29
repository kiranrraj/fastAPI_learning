export interface User {
    userId: string
    name: string
    email: string
    phone: string
    role: string
    preferences: string[]
    allowedContent: string[]
}

export interface UserState {
    session: {
        user: User
    } | null
}
