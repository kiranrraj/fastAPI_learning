// src/app/utils/sidebar/favoriteHandler.ts

export const MAX_FAVORITES = 5;

/**
 * Toggles favorite state with a limit.
 *
 * @param currentFavorites - Current favorite state map
 * @param itemId - ID of the item being toggled
 * @returns Updated state + optional warning info
 */
export function handleFavoriteToggleWithLimit(
    currentFavorites: Record<string, boolean>,
    itemId: string
): {
    updatedFavorites: Record<string, boolean>;
    showLimitWarning: boolean;
    disableFurther: boolean;
    message?: string;
} {
    const isCurrentlyFav = !!currentFavorites[itemId];
    const activeCount = Object.values(currentFavorites).filter(Boolean).length;

    // Case: Unfavorite
    if (isCurrentlyFav) {
        const { [itemId]: _, ...rest } = currentFavorites;
        return {
            updatedFavorites: { ...rest, [itemId]: false },
            showLimitWarning: false,
            disableFurther: false,
        };
    }

    // Case: Max limit reached
    if (activeCount >= MAX_FAVORITES) {
        return {
            updatedFavorites: currentFavorites,
            showLimitWarning: true,
            disableFurther: true,
            message: `You can only select up to ${MAX_FAVORITES} favorites.`,
        };
    }

    // Case: Add to favorites
    return {
        updatedFavorites: { ...currentFavorites, [itemId]: true },
        showLimitWarning: false,
        disableFurther: false,
    };
}
