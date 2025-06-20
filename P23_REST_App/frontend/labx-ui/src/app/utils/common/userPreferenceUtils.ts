const STORAGE_KEY = "labxUserPrefs";

export interface UserPreferences {
    sortAsc?: boolean;
    pinnedIds?: string[];
    sidebarCollapsed?: boolean;
    theme?: "light" | "dark";
}

export function getUserPrefs(): UserPreferences {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.error("Failed to load preferences:", e);
        return {};
    }
}

export function setUserPrefs(prefs: Partial<UserPreferences>) {
    try {
        const current = getUserPrefs();
        const updated = { ...current, ...prefs };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to save preferences:", e);
    }
}

export function clearUserPrefs() {
    localStorage.removeItem(STORAGE_KEY);
}
