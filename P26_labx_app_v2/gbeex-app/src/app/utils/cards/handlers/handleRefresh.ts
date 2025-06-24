// src/app/utils/cards/handlers/handleRefresh.ts

import { executeRefreshLogic } from "@/app/utils/cards/logic/refreshLogic";

/**
 * Handler function triggered by the UI (button click).
 * Manages local loading state and delegates logic to refresh executor.
 */
export async function handleRefresh(
    cardId: string,
    setLoading: (loading: boolean) => void,
    onRefresh?: (id: string) => void
): Promise<void> {
    setLoading(true);
    await executeRefreshLogic(cardId, onRefresh);
    setLoading(false);
}
