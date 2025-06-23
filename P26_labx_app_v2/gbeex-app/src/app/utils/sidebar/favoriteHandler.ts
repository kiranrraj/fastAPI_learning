// src/app/utils/sidebar/favoriteHandler.ts

export const MAX_FAVORITES = 5;

/**
 * Toggles favorite state with a limit.
 *
 * @param currentFavorites Current favorite state object
 * @param itemId Item to toggle
 * @returns Updated favorites and optional warning
 */
export function handleFavoriteToggleWithLimit(
    currentFavorites: Record<string, boolean>,
    itemId: string
): {
    updatedFavorites: Record<string, boolean>;
    showLimitWarning: boolean;
    disableFurther: boolean;
} {
    const isCurrentlyFav = !!currentFavorites[itemId];
    const activeCount = Object.values(currentFavorites).filter(Boolean).length;

    // If already favorite, allow un-favoriting
    if (isCurrentlyFav) {
        const { [itemId]: _, ...rest } = currentFavorites;
        return {
            updatedFavorites: { ...rest, [itemId]: false },
            showLimitWarning: false,
            disableFurther: false,
        };
    }

    // Prevent adding more if at max
    if (activeCount >= MAX_FAVORITES) {
        return {
            updatedFavorites: currentFavorites,
            showLimitWarning: true,
            disableFurther: true,
        };
    }

    // Otherwise, add to favorites
    return {
        updatedFavorites: { ...currentFavorites, [itemId]: true },
        showLimitWarning: false,
        disableFurther: false,
    };
}
