// --- Market selection generation ---

import { WikiCard } from "@/types";
import { fetchSlotArticles, convertToCard } from "./booster";

/** Generate a daily selection for the market (100% Natural) */
export const generateMarketSelection = async (size: number = 6): Promise<WikiCard[]> => {
    // Definir specific slots for a balanced market
    const slots: ("Top" | "High" | "Mid" | "Random")[] = [
        "Top",    // Possible Legendary slot
        "High",   // Epic slot
        "Mid",    // Uncommon / Rare slot
        "Random",
        "Random",
        "High"    // Another Epic slot
    ];

    const cards: WikiCard[] = [];

    for (let i = 0; i < size; i++) {
        const tier = slots[i] || "Random";
        const candidates = await fetchSlotArticles(undefined, 1, tier);

        if (candidates.length > 0) {
            const card = await convertToCard(candidates[0]);
            cards.push(card);
        }
    }

    return cards;
};
