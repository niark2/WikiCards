import { WikiCard, Playlist } from "@/types";
import { safeGetJSON, safeSetJSON, isClientSide } from "./safe-storage";

export interface ActivityLog {
    id: string;
    type: 'booster_opened' | 'card_sold' | 'folder_created' | 'coins_added' | 'card_crafted' | 'card_bought' | 'collection_exported' | 'collection_imported' | 'code_redeemed';
    message: string;
    amount?: number;
    timestamp: number;
}

const COLLECTION_KEY = "wikicards_collection";
const PLAYLIST_KEY = "wikicards_playlists";
const LOGS_KEY = "wikicards_logs";
const DAILY_BOOSTER_KEY = "wikicards_daily_booster";
const MARKET_KEY = "wikicards_daily_market";
const REDEEMED_CODES_KEY = "wikicards_redeemed_codes";

export interface DailyBoosterInfo {
    count: number;
    lastReset: string; // ISO date string
}

export const getDailyBoosterInfo = (): DailyBoosterInfo => {
    const defaultInfo: DailyBoosterInfo = { count: 0, lastReset: new Date().toISOString() };
    if (!isClientSide()) return defaultInfo;

    const info = safeGetJSON<DailyBoosterInfo | null>(DAILY_BOOSTER_KEY, null);
    const today = new Date().toDateString();

    if (info) {
        const lastResetDate = new Date(info.lastReset).toDateString();
        if (today === lastResetDate) {
            return info;
        }
    }

    return defaultInfo;
};

export const incrementDailyBooster = (): void => {
    if (!isClientSide()) return;
    const info = getDailyBoosterInfo();
    const newInfo: DailyBoosterInfo = {
        count: info.count + 1,
        lastReset: new Date().toISOString()
    };
    safeSetJSON(DAILY_BOOSTER_KEY, newInfo);
};

const WIKICARD_DEFAULT: WikiCard = {
    id: 'wikicard-starter',
    wikiId: 'wikicard',
    title: 'WikiCard',
    extract: 'Ceci est la carte collector officielle de WikiCards ! Elle n\'a aucune valeur financière mais témoigne de votre début dans l\'aventure.',
    imageUrl: '/wikicard.png',
    views: 0,
    rarity: 'Common',
    url: 'https://github.com/thomas-guillouet/wikicards',
    addedAt: Date.now()
};

export const getCollection = (): WikiCard[] => {
    if (!isClientSide()) return [];

    // Check if collection is completely uninitialized (new visitor)
    if (localStorage.getItem(COLLECTION_KEY) === null) {
        const initial = [WIKICARD_DEFAULT];
        safeSetJSON(COLLECTION_KEY, initial);
        return initial;
    }

    return safeGetJSON<WikiCard[]>(COLLECTION_KEY, []);
};

export const saveCollection = (newCards: WikiCard[]): void => {
    if (!isClientSide()) return;
    const current = getCollection();

    newCards.forEach(card => {
        // We now allow duplicates. To make each card instance unique,
        // we append a unique suffix to the ID if it's being added to the collection.
        // This ensures the same Wikipedia article can be held multiple times.
        const uniqueId = `${card.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

        const cardToSave: WikiCard = {
            ...card,
            id: uniqueId,
            wikiId: card.wikiId || card.id, // Ensure wikiId is preserved or set from legacy id
            addedAt: card.addedAt || Date.now()
        };
        current.push(cardToSave);
    });

    safeSetJSON(COLLECTION_KEY, current);
};

export const removeCard = (cardId: string): void => {
    if (!isClientSide()) return;
    const current = getCollection();
    const idx = current.findIndex(c => c.id === cardId);
    if (idx !== -1) {
        current.splice(idx, 1);
        safeSetJSON(COLLECTION_KEY, current);

        // Also remove from any playlists
        const playlists = getPlaylists();
        const updatedPlaylists = playlists.map(p => ({
            ...p,
            cardIds: p.cardIds.filter(id => id !== cardId)
        }));
        savePlaylists(updatedPlaylists);
    }
};

export const getPlaylists = (): Playlist[] => {
    return safeGetJSON<Playlist[]>(PLAYLIST_KEY, []);
};

export const savePlaylists = (playlists: Playlist[]): void => {
    safeSetJSON(PLAYLIST_KEY, playlists);
};

export const getActivityLogs = (): ActivityLog[] => {
    return safeGetJSON<ActivityLog[]>(LOGS_KEY, []);
};

export const logActivity = (type: ActivityLog['type'], message: string, amount?: number): void => {
    if (!isClientSide()) return;
    const logs = getActivityLogs();
    const newLog: ActivityLog = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        amount,
        timestamp: Date.now()
    };
    // Keep only last 50 logs
    const updatedLogs = [newLog, ...logs].slice(0, 50);
    safeSetJSON(LOGS_KEY, updatedLogs);
};

export interface MarketInfo {
    cards: WikiCard[];
    boughtIds: string[];
    lastReset: string; // ISO date string
}

export const getMarketInfo = (): MarketInfo | null => {
    if (!isClientSide()) return null;
    return safeGetJSON<MarketInfo | null>(MARKET_KEY, null);
};

export const saveMarketInfo = (info: MarketInfo): void => {
    if (!isClientSide()) return;
    safeSetJSON(MARKET_KEY, info);
};

export const getRedeemedCodes = (): string[] => {
    return safeGetJSON<string[]>(REDEEMED_CODES_KEY, []);
};

export const markCodeAsRedeemed = (code: string): void => {
    if (!isClientSide()) return;
    const redeemed = getRedeemedCodes();
    if (!redeemed.includes(code)) {
        redeemed.push(code);
        safeSetJSON(REDEEMED_CODES_KEY, redeemed);
    }
};
