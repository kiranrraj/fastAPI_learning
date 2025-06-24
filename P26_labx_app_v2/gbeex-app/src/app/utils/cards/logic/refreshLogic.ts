// src/app/utils/cards/logic/refreshLogic.ts

/**
 * Triggers the actual refresh logic:
 * - Calls the external refresh handler (if provided)
 * - Waits for a simulated delay
 * - Ends loading state
 */
export function executeRefreshLogic(
    cardId: string,
    onRefresh?: (id: string) => void
): Promise<void> {
    return new Promise((resolve) => {
        onRefresh?.(cardId);
        setTimeout(resolve, 1000); // Simulated async API delay
    });
}
