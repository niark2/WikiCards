// --- Booster pack generation with Natural Selection ---

import { WikiCard, Rarity } from "@/types";
import { calculateRarity } from "../rarity";
import {
    CandidateArticle,
    WikiPageDetails,
    WIKI_API_URL,
    USER_AGENT,
} from "./types";
import { parseWikipediaIdentifier, truncateExtract } from "./utils";
import {
    fetchRandomArticles,
    fetchThematicArticles,
    fetchPopularArticles,
    fetchPageViews,
    fetchArticleDetails,
} from "./api";

// --- Slot-based Booster Generation ---

// Internal helper to fetch precisely for a slotted tier
export const fetchSlotArticles = async (
    theme: string | undefined,
    count: number,
    tierPriority: "Top" | "High" | "Mid" | "Random"
): Promise<CandidateArticle[]> => {
    let rawArticles: { id: number; title: string }[] = [];

    // Instead of random fetching and dropping, we fetch exactly the popularity tier we need for the slot.
    // 0 = Top ~1000 articles (Legendary territory)
    // 500 = High ~2000 articles (Epic territory)
    // 2500 = Mid articles (Rare/Uncommon territory)

    if (tierPriority === "Top") {
        rawArticles = await fetchPopularArticles(count * 2, Math.floor(Math.random() * 50)) || [];
    } else if (tierPriority === "High") {
        rawArticles = await fetchPopularArticles(count * 2, 100 + Math.floor(Math.random() * 300)) || [];
    } else if (tierPriority === "Mid") {
        const broadThemes = ["History", "Science", "World", "Music", "Art", "Technology", "Space", "Sports", "Geography", "Culture"];
        const randomTheme = broadThemes[Math.floor(Math.random() * broadThemes.length)];
        rawArticles = await fetchThematicArticles(randomTheme, count * 4);
    } else {
        // Random
        if (theme && theme !== "standard" && theme !== "golden" && theme !== "iron" && theme !== "uranium") {
            rawArticles = await fetchThematicArticles(theme, count * 2);
        } else {
            rawArticles = await fetchRandomArticles(count * 3) || [];
        }
    }

    if (!rawArticles || rawArticles.length === 0) return [];

    const ids = rawArticles.map(r => r.id.toString());
    if (ids.length === 0) return [];

    const detailsMap = await fetchArticleDetails(ids);

    return rawArticles
        .map(r => ({ ...r, details: detailsMap[r.id] as WikiPageDetails }))
        .filter(item => {
            const d = item.details;
            if (!d || d.missing === "") return false;
            if (!d.extract || d.extract.length < 40 || d.extract.includes("may refer to:")) return false;
            return true;
        })
        .sort(() => Math.random() - 0.5) // Shuffle the candidates
        .slice(0, count); // Strictly restrict to the exact amount of slots requested
};

export const convertToCard = async (
    candidate: CandidateArticle
): Promise<WikiCard> => {
    const views = await fetchPageViews(candidate.title);

    // Rarity is now mathematically strict, based 100% on natural Wikipedia views. Zero artificial chance.
    const rarity = calculateRarity(views, false);

    return {
        id: candidate.id.toString(),
        wikiId: candidate.id.toString(),
        title: candidate.title,
        extract: truncateExtract(candidate.details.extract || ""),
        imageUrl: candidate.details.original?.source || candidate.details.thumbnail?.source || null,
        views,
        rarity,
        url: candidate.details.fullurl || `https://en.wikipedia.org/?curid=${candidate.id}`,
    };
};

/** Optionally replace one card with a coin bundle */
const injectCoinCard = (cards: WikiCard[], theme: string | undefined): WikiCard[] => {
    let hasAddedCoin = false;

    return cards.map(card => {
        if (hasAddedCoin) return card;

        const coinChance = theme === "uranium" ? 0.4 : theme === "golden" ? 0.3 : theme === "iron" ? 0.2 : 0.15;
        if (Math.random() >= coinChance) return card;

        hasAddedCoin = true;

        const amountRoll = Math.random();
        let amount: number;
        let rarity: Rarity;

        // Ensure Uranium doesn't drop Common coins
        if (theme === "uranium" && amountRoll >= 0.65) {
            amount = 20; rarity = "Uncommon";
        } else {
            if (amountRoll < 0.05) { amount = 250; rarity = "Legendary"; }
            else if (amountRoll < 0.15) { amount = 100; rarity = "Epic"; }
            else if (amountRoll < 0.35) { amount = 50; rarity = "Rare"; }
            else if (amountRoll < 0.65) { amount = 20; rarity = "Uncommon"; }
            else { amount = 10; rarity = "Common"; }
        }

        return {
            ...card,
            id: `coin-${Date.now()}-${Math.random()}`,
            title: `${amount} WikiCoins`,
            extract: `A pouch containing ${amount} shimmering WikiCoins. Use them to buy more boosters!`,
            imageUrl: null,
            rarity,
            isCoinValue: amount,
            views: amount * 1000
        };
    });
};

// --- Public API ---

/** Generate a complete booster pack using Slot-Based Authentic Fetching */
export const generateBoosterPack = async (
    size: number = 5,
    theme?: string,
    customTitles?: string[]
): Promise<WikiCard[]> => {

    // If Custom Titles is provided, bypass slot logic and just fetch those direct.
    if (customTitles && customTitles.length > 0) {
        // (Legacy custom titles support for redeems)
        let rawArticles: { id: number; title: string }[] = [];
        const cleaned = customTitles.map(t => parseWikipediaIdentifier(t));
        const selected = cleaned.slice(0, size);

        const titlesParam = selected.map(t => encodeURIComponent(t)).join('|');
        const url = `${WIKI_API_URL}?action=query&titles=${titlesParam}&format=json&origin=*`;
        const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
        const data = await res.json();

        if (data.query?.pages) {
            interface PageResult { pageid?: number; title: string }
            rawArticles = Object.values(data.query.pages)
                .filter((p) => (p as PageResult).pageid)
                .map((p) => ({
                    id: (p as PageResult).pageid as number,
                    title: (p as PageResult).title,
                }));
        }

        const ids = rawArticles.map(r => r.id.toString());
        const detailsMap = await fetchArticleDetails(ids);

        const cards: WikiCard[] = [];
        for (const raw of rawArticles) {
            const candidate = { ...raw, details: detailsMap[raw.id] as WikiPageDetails };
            cards.push(await convertToCard(candidate));
        }
        // No coin injection for custom titles
        return cards;
    }

    // --- Standard Slot Definitions ---
    let candidates: CandidateArticle[] = [];

    if (theme === "uranium") {
        // Blueprint: Max 2 Legendaries exactly. No Commons.
        // Slot 1: Guaranteed Top Tier (Legendary territory)
        const slot1 = await fetchSlotArticles(theme, 1, "Top");
        // Slot 2: 50/50 Top Tier or High Tier (Possible 2nd Legendary or Epic)
        const slot2 = await fetchSlotArticles(theme, 1, Math.random() < 0.5 ? "Top" : "High");
        // Slots 3,4,5: Mid Tier (Rares/Uncommons to fill, guaranteed no Commons naturally by offset 2500)
        const slotsRest = await fetchSlotArticles(theme, 3, "Mid");

        candidates = [...slot1, ...slot2, ...slotsRest];

    } else if (theme === "golden") {
        // Blueprint: Max 1 Legendary naturally, at least 1 Epic.
        // Slot 1: High Tier (Guaranteed Epic territory)
        const slot1 = await fetchSlotArticles(theme, 1, "High");
        // Slots 2-5: Random Tier (Will naturally drop Commons/Uncommons/Rares. A Legendary is <0.01% chance)
        const slotsRest = await fetchSlotArticles(theme, 4, "Random");

        candidates = [...slot1, ...slotsRest];

    } else if (theme === "iron") {
        // Blueprint: 1 guaranteed Mid slot (Thematic/Popular enough), 4 Random
        const slot1 = await fetchSlotArticles(theme, 1, "Mid");
        const slotsRest = await fetchSlotArticles(theme, 4, "Random");
        candidates = [...slot1, ...slotsRest];
    } else {
        // standard & everything else
        candidates = await fetchSlotArticles(theme, 5, "Random");
    }

    // Convert everything to authentic cards
    const finalCards: WikiCard[] = [];

    for (let i = 0; i < candidates.length; i++) {
        let card = await convertToCard(candidates[i]);

        // --- Natural Selection (Retrying instead of modifying statistics) ---

        // Uranium: Maximize quality by strictly filtering out Commons
        while (theme === "uranium" && card.rarity === "Common") {
            const replacement = await fetchSlotArticles(theme, 1, "Mid");
            if (replacement.length > 0) card = await convertToCard(replacement[0]);
            else break;
        }

        // Iron: Guarantee at least 1 Rare+ card as per FAQ (on the first slot)
        while (theme === "iron" && i === 0 && (card.rarity === "Common" || card.rarity === "Uncommon")) {
            const replacement = await fetchSlotArticles(theme, 1, "Mid");
            if (replacement.length > 0) card = await convertToCard(replacement[0]);
            else break;
        }

        finalCards.push(card);
    }

    // Safety fallback
    if (finalCards.length < size && finalCards.length > 0) {
        while (finalCards.length < size) {
            finalCards.push({ ...finalCards[0], id: finalCards[0].id + Math.random() });
        }
    }

    return injectCoinCard(finalCards, theme);
};

/** Generate a single card with a specific natural rarity (used by WikiWheel) */
export const generateNaturalCard = async (targetRarity: 'Epic' | 'Legendary' | 'Rare'): Promise<WikiCard | null> => {
    let tier: "Top" | "High" | "Mid" = "Mid";
    if (targetRarity === 'Legendary') tier = "Top";
    else if (targetRarity === 'Epic') tier = "High";

    let attempts = 0;
    while (attempts < 10) {
        attempts++;
        // Use slot logic to get articles from the correct popularity strata
        const candidates = await fetchSlotArticles(undefined, 1, tier);
        if (candidates.length > 0) {
            const card = await convertToCard(candidates[0]);
            // Verify it naturally meets our criteria
            if (card.rarity === targetRarity) {
                return card;
            }
            // If it's a Legendary but we wanted Epic, it's still "rare enough" but maybe we want strict?
            // User says "il booste", so we want it to be REAL. 
            // If we hit a Legendary while looking for an Epic, it's even better, we can return it.
        }
    }

    // Final fallback: just give the best we found
    const lastTry = await fetchSlotArticles(undefined, 1, tier);
    if (lastTry.length > 0) {
        return await convertToCard(lastTry[0]);
    }

    return null;
};
