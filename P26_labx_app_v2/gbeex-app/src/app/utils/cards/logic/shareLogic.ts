// src/app/utils/cards/logic/shareLogic.ts

/**
 * Generates and copies a shareable link for the card.
 * Can be extended to include auth tokens, shortened URLs, etc.
 */
export function executeShareLogic(cardId: string): void {
    const url = `${window.location.origin}/tab?id=${cardId}`;
    navigator.clipboard.writeText(url);
}
