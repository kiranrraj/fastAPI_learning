// src/app/utils/cards/handlers/handleLink.ts

import { executeLinkLogic } from "@/app/utils/cards/logic/linkLogic";

/**
 * Opens detailed view for the portlet card. Hook-safe.
 */
export function handleLink(
    cardId: string,
    onLink?: (id: string) => void
): void {
    executeLinkLogic(cardId);
    onLink?.(cardId);
}
