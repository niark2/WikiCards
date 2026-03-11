// --- Low-level Wikipedia API fetch helpers ---

import { WikiCard } from "@/types";
import { calculateRarity } from "../rarity";
import {
    WikiRandomItem,
    WikiSearchItem,
    WikiPageDetails,
    WikiPageViewsItem,
    WikiImagePage,
    WIKI_API_URL,
    USER_AGENT,
} from "./types";
import { truncateExtract } from "./utils";

// --- Article fetchers ---

export const fetchRandomArticles = async (count: number = 5): Promise<WikiRandomItem[]> => {
    const url = `${WIKI_API_URL}?action=query&list=random&rnnamespace=0&rnlimit=${count}&format=json&origin=*`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const data = await res.json();
    return data.query.random.map((item: WikiRandomItem) => ({ id: item.id, title: item.title }));
};

export const fetchThematicArticles = async (theme: string, count: number = 5): Promise<WikiRandomItem[]> => {
    const offset = Math.floor(Math.random() * 1000);
    const url = `${WIKI_API_URL}?action=query&list=search&srsearch=${encodeURIComponent(theme)}&srlimit=50&sroffset=${offset}&format=json&origin=*`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const data = await res.json();
    const results: WikiSearchItem[] = data.query.search || [];
    const shuffled = results.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((item) => ({ id: item.pageid, title: item.title }));
};

export const fetchPopularArticles = async (count: number = 5, offset: number = 0): Promise<WikiRandomItem[]> => {
    const url = `${WIKI_API_URL}?action=query&generator=mostviewed&gpvimlimit=50&gpvimoffset=${offset}&prop=info&format=json&origin=*`;
    try {
        const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
        const data = await res.json();
        if (!data.query?.pages) return await fetchRandomArticles(count);

        interface MostViewedPage { pageid: number; title: string }
        const results = Object.values(data.query.pages).map((p) => ({
            id: (p as MostViewedPage).pageid,
            title: (p as MostViewedPage).title,
        }));

        const shuffled = results.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    } catch (e) {
        console.error("Error fetching popular articles", e);
        return await fetchRandomArticles(count);
    }
};

// --- Page views ---

export const fetchPageViews = async (title: string): Promise<number> => {
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

// --- Fallback Image Fetcher ---

export const fetchFallbackImage = async (imageTitles: string[]): Promise<string | null> => {
    if (!imageTitles || imageTitles.length === 0) return null;

    const excludedKeywords = [
        "red pog", "blue pog", "green pog", "yellow pog", "white pog", "black pog",
        "commons-logo", "question book", "ambox", "edit-clear", "magnifying glass",
        "wikisource-logo", "wikibooks-logo", "wikiquote-logo", "wiktionary-logo",
        "wikimedia-logo", "folder hexagonal", "symbol", "stub", "icon", "arrow",
        "increase", "decrease", "portal-puzzle", "star", "padlock", "discourse",
        "wikimedia", "magnifying", "search", "increase", "decrease", "padlock"
    ];

    const filtered = imageTitles.filter(title => {
        const lower = title.toLowerCase();
        return !excludedKeywords.some(keyword => lower.includes(keyword));
    });

    if (filtered.length === 0) return null;

    // Sort to prefer "map", "location", "photo", "flag"
    const sorted = [...filtered].sort((a, b) => {
        const keywords = ["map", "location", "photo", "flag", "landscape", "portrait"];
        const aScore = keywords.findIndex(k => a.toLowerCase().includes(k));
        const bScore = keywords.findIndex(k => b.toLowerCase().includes(k));

        if (aScore !== -1 && bScore !== -1) return aScore - bScore;
        if (aScore !== -1) return -1;
        if (bScore !== -1) return 1;
        return 0;
    });

    const candidates = sorted.slice(0, 3);
    const titlesParam = candidates.map(t => encodeURIComponent(t)).join('|');
    const url = `${WIKI_API_URL}?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*`;

    try {
        const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
        const data = await res.json();
        const pages = data.query?.pages || {};

        // Important: preserve sort order from our sorting logic
        const results = Object.values(pages) as WikiImagePage[];
        for (const title of candidates) {
            const page = results.find(p => p.title === title);
            if (page?.imageinfo?.[0]?.thumburl) return page.imageinfo[0].thumburl;
            if (page?.imageinfo?.[0]?.url && !page.imageinfo[0].url.endsWith(".svg")) return page.imageinfo[0].url;
        }
    } catch (e) {
        console.error("Error fetching fallback image info:", e);
    }
    return null;
};

// --- Article details ---

export const fetchArticleDetails = async (pageids: string[]): Promise<Record<string, WikiPageDetails>> => {
    const ids = pageids.join("|");
    const url = `${WIKI_API_URL}?action=query&prop=extracts%7Cpageimages%7Cinfo%7Cimages%7Ccategories&exintro=1&explaintext=1&piprop=original%7Cthumbnail&pithumbsize=800&pilicense=any&imlimit=50&cllimit=50&inprop=url&pageids=${ids}&format=json&origin=*`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const data = await res.json();
    return data.query.pages as Record<string, WikiPageDetails>;
};

// --- Single article fetch ---

export const fetchWikiArticle = async (pageIdentifier: string, full: boolean = false): Promise<WikiCard | null> => {
    const isId = /^\d+$/.test(pageIdentifier);
    const param = isId ? `pageids=${pageIdentifier}` : `titles=${encodeURIComponent(pageIdentifier)}`;

    // If full is true, we don't use exintro so we get more than just the first paragraph
    const introParam = full ? "" : "&exintro=1";
    const url = `${WIKI_API_URL}?action=query&prop=extracts%7Cpageimages%7Cinfo%7Cimages%7Ccategories&explaintext=1${introParam}&piprop=original%7Cthumbnail&pithumbsize=1000&pilicense=any&imlimit=50&cllimit=50&inprop=url&${param}&redirects=1&format=json&origin=*`;

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

        let imageUrl = details.original?.source || details.thumbnail?.source || null;
        if (!imageUrl && details.images && details.images.length > 0) {
            imageUrl = await fetchFallbackImage(details.images.map(img => img.title));
        }

        const wikiCategories = details.categories
            ?.map(cat => cat.title.replace(/^Category:/, ''))
            .filter(cat => !/^(All |Articles |CS1 |Webarchive |Wikipedia |Commons category |Use dmy dates|Use mdy dates)/.test(cat)) || [];

        return {
            id: pageId,
            wikiId: pageId,
            title: details.title,
            extract: full ? (details.extract || "") : truncateExtract(details.extract || ""),
            imageUrl,
            views,
            rarity,
            url: details.fullurl || `https://en.wikipedia.org/?curid=${pageId}`,
            wikiCategories,
        };
    } catch (e) {
        console.error("Error fetching Wiki article:", e);
        return null;
    }
};
