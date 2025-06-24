// src/app/utils/cards/logic/lockLogic.ts

/**
 * Toggles the lock state for a portlet card.
 * Optionally persist to localStorage or trigger external sync.
 */
export function executeLockLogic(
    cardId: string,
    currentLocked: boolean
): boolean {
    const newLockedState = !currentLocked;

    // Optional: Persist lock state
    // localStorage.setItem(`card:${cardId}:locked`, JSON.stringify(newLockedState));

    return newLockedState;
}
