// src/app/utils/cards/logic/linkLogic.ts

/**
 * Opens a detailed or external view for the given card.
 * Can be internal or external route.
 */
export function executeLinkLogic(cardId: string): void {
    const detailUrl = `/detail/${cardId}`;
    window.open(detailUrl, "_blank");
}
