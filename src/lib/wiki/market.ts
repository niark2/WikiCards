// --- Market selection generation ---

import { WikiCard } from "@/types";
import { CandidateArticle, WikiPageDetails } from "./types";
import { truncateExtract } from "./utils";
import {
    fetchThematicArticles,
    fetchRandomArticles,
    fetchArticleDetails,
    fetchPageViews,
} from "./api";
import { calculateRarity } from "../rarity";

/** Fetch and filter candidate articles (simplified version for market) */
const fetchMarketCandidates = async (
    theme: string | undefined,
    count: number
): Promise<CandidateArticle[]> => {
    const rawArticles = theme
        ? await fetchThematicArticles(theme, count)
        : await fetchRandomArticles(count * 2);

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

/** Convert a candidate to a market card */
const convertToMarketCard = async (candidate: CandidateArticle): Promise<WikiCard> => {
    const views = await fetchPageViews(candidate.title);
    const isFeatured = views > 1000000 && Math.random() < 0.1;
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

/** Generate a daily selection for the market */
export const generateMarketSelection = async (size: number = 6): Promise<WikiCard[]> => {
    const cards: WikiCard[] = [];
    const themes = ["History", "Science", "Art", "Geography", "Technology", "Culture", "Music"];
    let attempts = 0;

    while (cards.length < size && attempts < 12) {
        attempts++;
        const needed = size - cards.length;
        const randomTheme = Math.random() < 0.7 ? themes[Math.floor(Math.random() * themes.length)] : undefined;

        const candidates = await fetchMarketCandidates(randomTheme, needed);

        for (const candidate of candidates) {
            if (cards.length >= size) break;
            // High standard for market: MUST have an image in first few attempts
            if (!candidate.details.original && !candidate.details.thumbnail && attempts < 5) continue;

            const card = await convertToMarketCard(candidate);

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
