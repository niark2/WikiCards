/**
 * Wrapper around localStorage that safely handles SSR (server-side rendering).
 * All localStorage access in the app should go through these helpers
 * to avoid repeating `typeof window === "undefined"` checks everywhere.
 */

export const safeGetItem = (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
};

export const safeSetItem = (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
};

export const safeGetJSON = <T>(key: string, fallback: T): T => {
    const raw = safeGetItem(key);
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
};

export const safeSetJSON = <T>(key: string, value: T): void => {
    safeSetItem(key, JSON.stringify(value));
};

export const isClientSide = (): boolean => typeof window !== "undefined";
