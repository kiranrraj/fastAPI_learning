// src/app/utils/common/pinUtils.ts

export function togglePin(pinnedIds: string[], id: string): string[] {
    return pinnedIds.includes(id)
        ? pinnedIds.filter((item) => item !== id)
        : [...pinnedIds, id];
}

export function isPinned(pinnedIds: string[], id: string): boolean {
    return pinnedIds.includes(id);
}
