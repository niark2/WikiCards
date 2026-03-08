// --- Wikipedia API types ---

export interface WikiRandomItem {
    id: number;
    title: string;
}

export interface WikiSearchItem {
    pageid: number;
    title: string;
}

export interface WikiPageDetails {
    pageid: number;
    title: string;
    extract?: string;
    original?: { source: string };
    thumbnail?: { source: string };
    fullurl?: string;
    missing?: string;
}

export interface WikiPageViewsItem {
    views: number;
}

export interface CandidateArticle {
    id: number;
    title: string;
    details: WikiPageDetails;
}

// --- Constants ---

export const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";
export const USER_AGENT = "WikiCards/1.0 (test@example.com)";
export const MAX_EXTRACT_LENGTH = 150;
