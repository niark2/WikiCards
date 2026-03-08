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

// --- Booster config (Natural Selection parameters) ---

interface BoosterConfig {
    legendaryChance: number;
    allowCommon: boolean;
}

const BOOSTER_CONFIG: Record<string, BoosterConfig> = {
    uranium: {
        legendaryChance: 0.4,
        allowCommon: false,
    },
    golden: {
        legendaryChance: 0.1,
        allowCommon: true,
    },
    iron: {
        legendaryChance: 0.02,
        allowCommon: true,
    },
    standard: {
        legendaryChance: 0.005,
        allowCommon: true,
    },
};

// --- Internal helpers ---

/** Fetch and filter candidate articles with valid extracts */
const fetchCandidateArticles = async (
    theme: string | undefined,
    isRandomEdition: boolean,
    needsThematic: boolean,
    count: number,
    customTitles?: string[]
): Promise<CandidateArticle[]> => {
    let rawArticles: { id: number; title: string }[] = [];

    if (customTitles && customTitles.length > 0) {
        const cleaned = customTitles.map(t => parseWikipediaIdentifier(t));
        const shuffled = [...cleaned].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count * 2);

        let baseUrl = WIKI_API_URL;
        const urlMatch = customTitles.find(t => t.includes("wikipedia.org/wiki/"));
        if (urlMatch) {
            const lang = urlMatch.match(/https?:\/\/([a-z-]+)\.wikipedia\.org/);
            if (lang && lang[1]) {
                baseUrl = `https://${lang[1]}.wikipedia.org/w/api.php`;
            }
        }

        const titlesParam = selected.map(t => encodeURIComponent(t)).join('|');
        const url = `${baseUrl}?action=query&titles=${titlesParam}&format=json&origin=*`;
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
    } else {
        const isPremium = theme === "iron" || theme === "golden" || theme === "uranium";
        const shouldFetchThematic = theme && !isRandomEdition && needsThematic;

        if (shouldFetchThematic) {
            rawArticles = await fetchThematicArticles(theme, count);
        } else if (theme === "uranium") {
            const topTier = await fetchPopularArticles(2, 0);
            const highTier = await fetchPopularArticles(2, 500);
            const midTier = await fetchPopularArticles(count - 4 > 0 ? count - 4 : 2, 2000);
            rawArticles = [...topTier, ...highTier, ...midTier];
        } else if (isPremium) {
            const offset = theme === "golden" ? 500 : 1500;
            rawArticles = await fetchPopularArticles(count * 2, offset);
        } else {
            rawArticles = await fetchRandomArticles(count * 2);
        }
    }

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
        .sort((a, b) => {
            const aHasImg = a.details.original || a.details.thumbnail ? 1 : 0;
            const bHasImg = b.details.original || b.details.thumbnail ? 1 : 0;
            return bHasImg - aHasImg || Math.random() - 0.5;
        });
};

/** Convert a candidate article into a WikiCard (100% authentic, no artificial boost) */
const convertToCard = async (
    candidate: CandidateArticle,
    theme: string | undefined
): Promise<WikiCard> => {
    const views = await fetchPageViews(candidate.title);
    const isGolden = theme === "golden";
    const isUranium = theme === "uranium";

    const isFeatured = isUranium
        ? (Math.random() < 0.4)
        : isGolden
            ? (views > 50000 && Math.random() < 0.3)
            : (views > 1000000 && Math.random() < 0.1);

    const rarity = calculateRarity(views, isFeatured);

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

/** Guarantee minimum rarity as a safety net */
const guaranteeMinimumRarity = (cards: WikiCard[], theme: string | undefined): void => {
    if (theme === "uranium") {
        const epicCount = cards.filter(c => c.rarity === "Epic" || c.rarity === "Legendary").length;
        if (epicCount < 2) {
            const needed = 2 - epicCount;
            let upgraded = 0;
            for (let i = 0; i < cards.length && upgraded < needed; i++) {
                if (cards[i].rarity !== "Epic" && cards[i].rarity !== "Legendary" && !cards[i].isCoinValue) {
                    cards[i].rarity = "Epic";
                    upgraded++;
                }
            }
        }
    } else {
        const hasRare = cards.some(c => c.rarity !== "Common" && !c.isCoinValue);
        if (!hasRare && cards.length > 0) {
            cards[0].rarity = theme === "golden" ? "Epic" : theme === "iron" ? "Rare" : "Uncommon";
        }
    }
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

        if (amountRoll < 0.05) { amount = 250; rarity = "Legendary"; }
        else if (amountRoll < 0.15) { amount = 100; rarity = "Epic"; }
        else if (amountRoll < 0.35) { amount = 50; rarity = "Rare"; }
        else if (amountRoll < 0.65) { amount = 20; rarity = "Uncommon"; }
        else { amount = 10; rarity = "Common"; }

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

/** Generate a complete booster pack using Natural Selection */
export const generateBoosterPack = async (
    size: number = 5,
    theme?: string,
    customTitles?: string[]
): Promise<WikiCard[]> => {
    const cards: WikiCard[] = [];
    const isRandomEdition = theme === "golden" || theme === "uranium" || theme === "iron" || !theme;
    let attempts = 0;

    const configKey = (theme as keyof typeof BOOSTER_CONFIG) || "standard";
    const settings = BOOSTER_CONFIG[configKey] || BOOSTER_CONFIG.standard;

    let targetLegendaries = 0;
    if (settings.legendaryChance > 0) {
        targetLegendaries = Math.random() < settings.legendaryChance ? 1 : 0;
    }

    let legendaryFound = 0;

    // The Selection Loop
    while (cards.length < size && attempts < 20) {
        attempts++;

        const candidates = await fetchCandidateArticles(
            theme,
            isRandomEdition,
            cards.length < 2 || !!customTitles,
            3,
            customTitles
        );

        for (const candidate of candidates) {
            if (cards.length >= size) break;
            const card = await convertToCard(candidate, theme);

            // 1. Common Filter
            if (!settings.allowCommon && card.rarity === "Common") continue;

            // 2. Legendary Natural Filtering
            if (card.rarity === "Legendary") {
                if (legendaryFound < targetLegendaries) {
                    cards.push(card);
                    legendaryFound++;
                } else {
                    continue;
                }
            }
            // 3. Accept all other rarities
            else {
                cards.push(card);
            }
        }
    }

    // Safety net for edge cases
    guaranteeMinimumRarity(cards, theme);
    return injectCoinCard(cards, theme);
};
