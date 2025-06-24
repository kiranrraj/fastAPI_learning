// src/app/utils/cards/handlers/handleLock.ts

import { executeLockLogic } from "@/app/utils/cards/logic/lockLogic";

/**
 * Toggles lock/unlock for the card and triggers external update.
 */
export function handleLock(
    cardId: string,
    currentLocked: boolean,
    setLocked: (locked: boolean) => void,
    onToggleLock?: (id: string, locked: boolean) => void
): void {
    const newLocked = executeLockLogic(cardId, currentLocked);
    setLocked(newLocked);
    onToggleLock?.(cardId, newLocked);
}
