// src/app/utils/cards/logic/pinLogic.ts

/**
 * Toggles the pinned state for a card.
 * Returns the new state. Can be persisted.
 */
export function executePinLogic(
    cardId: string,
    currentPinned: boolean
): boolean {
    const newPinned = !currentPinned;

    // Optional: persist
    // localStorage.setItem(`card:${cardId}:pinned`, JSON.stringify(newPinned));

    return newPinned;
}
