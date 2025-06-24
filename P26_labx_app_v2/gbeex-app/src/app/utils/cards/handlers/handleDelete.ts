// src/app/utils/cards/handlers/handleDelete.ts

import { executeDeleteLogic } from "../logic/deleteLogic";

/**
 * Handles the delete interaction for a card.
 * If confirmed, hides the card and triggers external delete callback.
 */
export function handleDelete(
    cardId: string,
    setDeleted: (val: boolean) => void,
    onDelete?: (id: string) => void
): void {
    const result = executeDeleteLogic(cardId);

    if (!result.confirmed) return;

    setDeleted(true);

    setTimeout(() => {
        onDelete?.(cardId);
    }, result.delay ?? 0);
}
