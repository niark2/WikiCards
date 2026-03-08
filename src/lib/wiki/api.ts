// --- Low-level Wikipedia API fetch helpers ---

import { WikiCard } from "@/types";
import { calculateRarity } from "../rarity";
import {
    WikiRandomItem,
    WikiSearchItem,
    WikiPageDetails,
    WikiPageViewsItem,
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

// --- Article details ---

export const fetchArticleDetails = async (pageids: string[]): Promise<Record<string, WikiPageDetails>> => {
    const ids = pageids.join("|");
    const url = `${WIKI_API_URL}?action=query&prop=extracts%7Cpageimages%7Cinfo&exintro=1&explaintext=1&piprop=original%7Cthumbnail&pithumbsize=800&pilicense=any&inprop=url&pageids=${ids}&format=json&origin=*`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const data = await res.json();
    return data.query.pages as Record<string, WikiPageDetails>;
};

// --- Single article fetch ---

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
