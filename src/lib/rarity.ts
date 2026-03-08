import { Rarity } from "../types";

/**
 * All rarity-related domain constants and logic live here.
 * Single source of truth for thresholds, weights, sell values, and craft costs.
 */

// --- Rarity calculation from monthly pageviews ---

export const calculateRarity = (views: number, isFeatured?: boolean): Rarity => {
    if (isFeatured) return "Legendary";
    if (views >= 100000) return "Legendary";
    if (views >= 20000) return "Epic";
    if (views >= 5000) return "Rare";
    if (views >= 500) return "Uncommon";
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
