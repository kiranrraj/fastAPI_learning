// src/app/utils/cards/handlers/handleShare.ts

import { executeShareLogic } from "@/app/utils/cards/logic/shareLogic";

/**
 * UI-facing share handler. Triggers share logic, then provides feedback.
 */
export function handleShare(
    cardId: string,
    onShare?: (id: string) => void
): void {
    executeShareLogic(cardId);
    alert("Link copied to clipboard!"); // Replace with toast in prod
    onShare?.(cardId);
}
