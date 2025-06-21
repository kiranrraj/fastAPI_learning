/**
 * Toggles a boolean value in an object.
 */
export function toggleValue<T extends object>(
    state: T,
    key: keyof T
): T {
    return {
        ...state,
        [key]: !state[key],
    };
}

/**
 * Cycles through a list of values for a given key in an object.
 */
export function cycleValue<T extends object, V>(
    state: T,
    key: keyof T,
    options: V[]
): T {
    const current = state[key];
    const index = options.indexOf(current as V);
    const next = options[(index + 1) % options.length];
    return {
        ...state,
        [key]: next,
    };
}

/**
 * Toggles a string value in a Set.
 */
export function toggleSetValue(set: Set<string>, value: string): Set<string> {
    const next = new Set(set);
    if (next.has(value)) {
        next.delete(value);
    } else {
        next.add(value);
    }
    return next;
}
