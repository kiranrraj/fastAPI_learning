// src/app/utils/sidebar/favoriteHandler.ts

export const MAX_FAVORITES = 5;

export function handleFavoriteToggleWithLimit(
    currentFavorites: Record<string, boolean>,
    itemId: string
): {
    updatedFavorites: Record<string, boolean>;
    showLimitWarning: boolean;
    message?: string;
} {
    const isCurrentlyFav = !!currentFavorites[itemId];
    const activeCount = Object.values(currentFavorites).filter(Boolean).length;

    if (isCurrentlyFav) {
        const { [itemId]: _, ...rest } = currentFavorites;
        return {
            updatedFavorites: rest,
            showLimitWarning: false,
        };
    }

    if (activeCount >= MAX_FAVORITES) {
        return {
            updatedFavorites: currentFavorites,
            showLimitWarning: true,
            message: `Maximum ${MAX_FAVORITES} favorites allowed.`,
        };
    }

    return {
        updatedFavorites: { ...currentFavorites, [itemId]: true },
        showLimitWarning: false,
    };
}
