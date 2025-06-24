// src/app/utils/cards/handlers/handlePin.ts

import { executePinLogic } from "@/app/utils/cards/logic/pinLogic";

/**
 * Handles pin/unpin toggling for a card.
 */
export function handlePin(
    cardId: string,
    currentPinned: boolean,
    setPinned: (pinned: boolean) => void,
    onTogglePin?: (id: string, pinned: boolean) => void
): void {
    const newPinned = executePinLogic(cardId, currentPinned);
    setPinned(newPinned);
    onTogglePin?.(cardId, newPinned);
}
