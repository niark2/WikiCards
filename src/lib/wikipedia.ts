import { WikiCard, Rarity } from "@/types";
import { calculateRarity } from "./rarity";

// --- API types (replacing all `any`) ---

interface WikiRandomItem {
    id: number;
    title: string;
}

interface WikiSearchItem {
    pageid: number;
    title: string;
}

interface WikiPageDetails {
    pageid: number;
    title: string;
    extract?: string;
    original?: { source: string };
    thumbnail?: { source: string };
    fullurl?: string;
    missing?: string;
}

interface WikiPageViewsItem {
    views: number;
}

// --- Constants ---

const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";
const USER_AGENT = "WikiCards/1.0 (test@example.com)";
const MAX_EXTRACT_LENGTH = 150;

// --- Low-level fetch helpers ---

const fetchRandomArticles = async (count: number = 5): Promise<WikiRandomItem[]> => {
    const url = `${WIKI_API_URL}?action=query&list=random&rnnamespace=0&rnlimit=${count}&format=json&origin=*`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const data = await res.json();
    return data.query.random.map((item: WikiRandomItem) => ({ id: item.id, title: item.title }));
};

const fetchThematicArticles = async (theme: string, count: number = 5): Promise<WikiRandomItem[]> => {
    const offset = Math.floor(Math.random() * 1000);
    const url = `${WIKI_API_URL}?action=query&list=search&srsearch=${encodeURIComponent(theme)}&srlimit=50&sroffset=${offset}&format=json&origin=*`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const data = await res.json();
    const results: WikiSearchItem[] = data.query.search || [];
    const shuffled = results.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((item) => ({ id: item.pageid, title: item.title }));
};

const fetchPageViews = async (title: string): Promise<number> => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    const formatDate = (d: Date) => d.toISOString().split("T")[0].replace(/-/g, "");

    try {
        const res = await fetch(
            `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(title)}/daily/${formatDate(start)}/${formatDate(end)}`,
            { headers: { "User-Agent": USER_AGENT } }
        );
        if (!res.ok) return 100;
        const data = await res.json();
        return data.items.reduce((sum: number, item: WikiPageViewsItem) => sum + item.views, 0);
    } catch {
        return 100;
    }
};

export const fetchArticleDetails = async (pageids: string[]): Promise<Record<string, WikiPageDetails>> => {
    const ids = pageids.join("|");
    const url = `${WIKI_API_URL}?action=query&prop=extracts%7Cpageimages%7Cinfo&exintro=1&explaintext=1&piprop=original%7Cthumbnail&pithumbsize=800&pilicense=any&inprop=url&pageids=${ids}&format=json&origin=*`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const data = await res.json();
    return data.query.pages as Record<string, WikiPageDetails>;
};

// --- URL parsing ---

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

// --- Truncation helper ---

const truncateExtract = (extract: string): string => {
    if (extract.length <= MAX_EXTRACT_LENGTH) return extract;
    return extract.substring(0, MAX_EXTRACT_LENGTH) + "...";
};

// --- Public: fetch a single article ---

export const fetchWikiArticle = async (pageIdentifier: string): Promise<WikiCard | null> => {
    const isId = /^\d+$/.test(pageIdentifier);
    const param = isId ? `pageids=${pageIdentifier}` : `titles=${encodeURIComponent(pageIdentifier)}`;

    const url = `${WIKI_API_URL}?action=query&prop=extracts%7Cpageimages%7Cinfo&exintro=1&explaintext=1&piprop=original%7Cthumbnail&pithumbsize=1000&pilicense=any&inprop=url&${param}&redirects=1&format=json&origin=*`;

    try {
        const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
        const data = await res.json();

        if (!data.query?.pages) return null;

        const pages: Record<string, WikiPageDetails> = data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId === "-1") return null;

        const details = pages[pageId];
        if (!details || (!details.extract && !details.title)) return null;

        const views = await fetchPageViews(details.title);
        const rarity = calculateRarity(views, false);

        return {
            id: pageId,
            wikiId: pageId,
            title: details.title,
            extract: truncateExtract(details.extract || ""),
            imageUrl: details.original?.source || details.thumbnail?.source || null,
            views,
            rarity,
            url: details.fullurl || `https://en.wikipedia.org/?curid=${pageId}`,
        };
    } catch (e) {
        console.error("Error fetching Wiki article:", e);
        return null;
    }
};

// --- Booster pack generation (decomposed) ---

interface CandidateArticle {
    id: number;
    title: string;
    details: WikiPageDetails;
}

/** Fetch and filter candidate articles with valid extracts */
const fetchCandidateArticles = async (
    theme: string | undefined,
    isGolden: boolean,
    needsThematic: boolean,
    count: number,
    customTitles?: string[]
): Promise<CandidateArticle[]> => {
    let rawArticles: { id: number; title: string }[] = [];

    if (customTitles && customTitles.length > 0) {
        // Resolve titles to IDs and basic info
        const cleaned = customTitles.map(t => parseWikipediaIdentifier(t));
        const shuffled = [...cleaned].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count * 2);

        // Use the first lang found in URLs or default to en
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
            rawArticles = Object.values(data.query.pages)
                .filter((p: any) => p.pageid) // Filter out missing pages
                .map((p: any) => ({
                    id: p.pageid,
                    title: p.title
                }));
        }
    } else {
        const shouldFetchThematic = theme && !isGolden && needsThematic;
        rawArticles = shouldFetchThematic
            ? await fetchThematicArticles(theme, count)
            : await fetchRandomArticles(count * 2);
    }

    const ids = rawArticles.map(r => r.id.toString());
    if (ids.length === 0) return [];

    const detailsMap = await fetchArticleDetails(ids);

    return rawArticles
        .map(r => ({ ...r, details: detailsMap[r.id] as WikiPageDetails }))
        .filter(item => {
            const d = item.details;
            if (!d || d.missing === "") return false;
            // For custom titles, we might want to be less strict about extract length if needed, 
            // but keep it for consistency.
            if (!d.extract || d.extract.length < 40 || d.extract.includes("may refer to:")) return false;
            return true;
        })
        .sort((a, b) => {
            const aHasImg = a.details.original || a.details.thumbnail ? 1 : 0;
            const bHasImg = b.details.original || b.details.thumbnail ? 1 : 0;
            return bHasImg - aHasImg || Math.random() - 0.5;
        });
};

/** Convert a candidate article into a WikiCard */
const convertToCard = async (
    candidate: CandidateArticle,
    theme: string | undefined
): Promise<WikiCard> => {
    const views = await fetchPageViews(candidate.title);
    const isGolden = theme === "golden";

    const isFeatured = isGolden
        ? (views > 50000 && Math.random() < 0.3)
        : (views > 1000000 && Math.random() < 0.1);

    const effectiveViews = isGolden ? views * 50 : views;
    const rarity = calculateRarity(effectiveViews, isFeatured);

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

/** Guarantee at least one uncommon-or-better card in the pack */
const guaranteeMinimumRarity = (cards: WikiCard[], theme: string | undefined): void => {
    const hasRare = cards.some(c => c.rarity !== "Common" && !c.isCoinValue);
    if (!hasRare && cards.length > 0) {
        cards[0].rarity = theme === "golden" ? "Epic" : "Uncommon";
    }
};

/** Optionally replace one card with a coin bundle */
const injectCoinCard = (cards: WikiCard[], theme: string | undefined): WikiCard[] => {
    let hasAddedCoin = false;

    return cards.map(card => {
        if (hasAddedCoin) return card;

        const coinChance = theme === "golden" ? 0.3 : 0.15;
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

/** Public: generate a complete booster pack */
export const generateBoosterPack = async (
    size: number = 5,
    theme?: string,
    customTitles?: string[]
): Promise<WikiCard[]> => {
    const cards: WikiCard[] = [];
    const isGolden = theme === "golden";
    let attempts = 0;

    while (cards.length < size && attempts < 5) {
        attempts++;
        const needed = size - cards.length;
        const needsThematic = cards.length < 2 || customTitles; // Thematic if we have custom titles

        const candidates = await fetchCandidateArticles(theme, isGolden, !!needsThematic, needed, customTitles);

        for (const candidate of candidates) {
            if (cards.length >= size) break;
            const card = await convertToCard(candidate, theme);
            cards.push(card);
        }
    }

    guaranteeMinimumRarity(cards, theme);
    return injectCoinCard(cards, theme);
};
/** Public: generate a daily selection for the market */
export const generateMarketSelection = async (size: number = 6): Promise<WikiCard[]> => {
    const cards: WikiCard[] = [];
    const themes = ["History", "Science", "Art", "Geography", "Technology", "Culture", "Music"];
    let attempts = 0;

    while (cards.length < size && attempts < 12) {
        attempts++;
        const needed = size - cards.length;
        // Pick a theme 70% of the time for market cards to ensure they are interesting
        const randomTheme = Math.random() < 0.7 ? themes[Math.floor(Math.random() * themes.length)] : undefined;

        const candidates = await fetchCandidateArticles(randomTheme, false, !!randomTheme, needed);

        for (const candidate of candidates) {
            if (cards.length >= size) break;
            // High standard for market: MUST have an image in first few attempts
            if (!candidate.details.original && !candidate.details.thumbnail && attempts < 5) continue;

            const card = await convertToCard(candidate, undefined);

            // Artificial floor for the 6 market slots
            const slot = cards.length;
            if (slot === 0 && (card.rarity === "Common" || card.rarity === "Uncommon")) {
                card.rarity = "Rare";
            } else if (slot === 1 && card.rarity === "Common") {
                card.rarity = "Uncommon";
            } else if (slot === 5 && Math.random() < 0.4 && card.rarity !== "Legendary") {
                card.rarity = "Epic";
            }

            cards.push(card);
        }
    }

    return cards;
};
