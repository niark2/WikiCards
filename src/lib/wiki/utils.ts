// --- URL parsing & text helpers ---

import { MAX_EXTRACT_LENGTH } from "./types";

/**
 * Parses a Wikipedia URL or article title into a clean identifier.
 * Handles full URLs like "https://en.wikipedia.org/wiki/Some_Article"
 * and plain titles like "Some Article".
 */
export const parseWikipediaIdentifier = (input: string): string => {
    let title = input.trim();
    if (input.includes("wikipedia.org/wiki/")) {
        const parts = input.split("wikipedia.org/wiki/");
        if (parts.length > 1) {
            title = parts[1].split(/[#?]/)[0].replace(/_/g, " ");
            title = decodeURIComponent(title);
        }
    }
    return title;
};

/** Truncate an extract to MAX_EXTRACT_LENGTH characters */
export const truncateExtract = (extract: string): string => {
    if (extract.length <= MAX_EXTRACT_LENGTH) return extract;
    return extract.substring(0, MAX_EXTRACT_LENGTH) + "...";
};
