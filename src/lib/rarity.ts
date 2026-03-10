import { Rarity } from "../types";

/**
 * All rarity-related domain constants and logic live here.
 * Single source of truth for thresholds, weights, sell values, and craft costs.
 */

// --- Rarity calculation from monthly pageviews ---

export const calculateRarity = (views: number, isFeatured?: boolean): Rarity => {
    if (isFeatured) return "Legendary";
    if (views >= 500000) return "Legendary";
    if (views >= 50000) return "Epic";
    if (views >= 10000) return "Rare";
    if (views >= 1000) return "Uncommon";
    return "Common";
};

// --- Rarity weight for sorting ---

export const RARITY_WEIGHT: Record<Rarity, number> = {
    Common: 1,
    Uncommon: 2,
    Rare: 3,
    Epic: 4,
    Legendary: 5,
};

// --- Sort order (highest rarity first) ---

export const RARITY_SORT_ORDER: Record<Rarity, number> = {
    Legendary: 0,
    Epic: 1,
    Rare: 2,
    Uncommon: 3,
    Common: 4,
};

// --- Coin values when selling cards ---

export const RARITY_SELL_VALUES: Record<Rarity, number> = {
    Common: 5,
    Uncommon: 10,
    Rare: 25,
    Epic: 100,
    Legendary: 500,
};

// --- Costs to forge/craft a card ---

export const RARITY_CRAFT_COSTS: Record<Rarity, number> = {
    Common: 100,
    Uncommon: 250,
    Rare: 750,
    Epic: 2500,
    Legendary: 10000,
};
// --- Costs to buy from market ---
export const RARITY_MARKET_PRICES: Record<Rarity, number> = {
    Common: 20,
    Uncommon: 50,
    Rare: 150,
    Epic: 400,
    Legendary: 1000,
};

// --- Dynamic Card Logic ---

export type CardGrade = "S" | "A" | "B" | "C" | "D";

/** Get a subject's grade based on popularity (views) */
export const getCardGrade = (views: number): CardGrade => {
    if (views >= 1000000) return "S";
    if (views >= 100000) return "A";
    if (views >= 10000) return "B";
    if (views >= 1000) return "C";
    return "D";
};

/**
 * Calculates a logical discard price for a card.
 * Range: 5 to 5000 WikiCoins.
 * Factors: Rarity, Views (Grade), Image, and Content.
 */
export const calculateCardValue = (card: { rarity: Rarity, views: number, imageUrl?: string | null, extract?: string, title?: string, wikiId?: string }): number => {
    // Base prices by rarity
    const basePrices: Record<Rarity, number> = {
        Common: 5,
        Uncommon: 20,
        Rare: 100,
        Epic: 400,
        Legendary: 1500,
    };

    // Special case for the official WikiCard card (collector item, non-sellable value)
    if (card.wikiId === "wikicard" || card.title === "WikiCard") return 0;

    const gradeMultipliers: Record<CardGrade, number> = {
        S: 2.5,
        A: 1.8,
        B: 1.3,
        C: 1.0,
        D: 0.8,
    };

    const base = basePrices[card.rarity] || 5;
    const grade = getCardGrade(card.views);
    const multiplier = gradeMultipliers[grade];

    let value = base * multiplier;

    // Bonus for having an image (+25%)
    if (card.imageUrl) {
        value *= 1.25;
    }

    // Bonus for substantial content (+10%)
    if (card.extract && card.extract.length > 200) {
        value *= 1.1;
    }

    // Return floor value, bounded between 5 and 5000
    return Math.min(5000, Math.max(5, Math.floor(value)));
};

/**
 * Calculates a logical craft cost for a card.
 * Based on the discard value and a multiplier depending on rarity.
 */
export const calculateCraftCost = (card: { rarity: Rarity, views: number, imageUrl?: string | null, extract?: string, title?: string, wikiId?: string }): number => {
    const discardValue = calculateCardValue(card);
    const multipliers: Record<Rarity, number> = {
        Common: 2,
        Uncommon: 3,
        Rare: 4,
        Epic: 6,
        Legendary: 8,
    };
    return Math.floor(discardValue * multipliers[card.rarity]);
};
