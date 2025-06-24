// src/app/utils/cards/logic/deleteLogic.ts

/**
 * Represents the result of a delete attempt.
 */
export interface DeleteResult {
    confirmed: boolean;
    delay?: number; // delay in ms before final removal (for undo)
}

/**
 * Executes the delete logic for a portlet card.
 * Prompts the user for confirmation, and returns a result object.
 * Can support delayed removal and undo logic in future.
 */
export function executeDeleteLogic(cardId: string): DeleteResult {
    const confirmed = window.confirm(`Are you sure you want to delete card "${cardId}"?`);

    if (!confirmed) {
        return { confirmed: false };
    }

    // Optional: allow undo delay (simulated here)
    const delay = 500;

    return { confirmed: true, delay };
}
