export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export interface WikiCard {
    id: string; // Unique instance ID in collection
    wikiId?: string; // Original Wikipedia page ID (if applicable)
    title: string;
    extract: string;
    imageUrl: string | null;
    views: number;
    rarity: Rarity;
    url: string;
    created?: string; // We might not have this depending on API
    isCoinValue?: number; // If set, this card is actually just a coin bundle
    addedAt?: number; // Timestamp when card was added to collection
}

export interface Playlist {
    id: string;
    name: string;
    cardIds: string[];
}
