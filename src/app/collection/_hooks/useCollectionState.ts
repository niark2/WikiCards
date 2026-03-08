"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getCollection, getPlaylists, savePlaylists, removeCard, logActivity } from "@/lib/storage";
import { WikiCard, Rarity, Playlist } from "@/types";
import { useCoins } from "@/hooks/useCoins";
import { safeSetItem } from "@/lib/safe-storage";
import { RARITY_SELL_VALUES, RARITY_SORT_ORDER } from "@/lib/rarity";

export type SortOption = "recent" | "rarity" | "alphabetical";

export interface CardGroup {
    card: WikiCard;
    ids: string[];
}

export function useCollectionState() {
    const [cards, setCards] = useState<WikiCard[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [cardSelectionMode, setCardSelectionMode] = useState(false);
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
    const [filter, setFilter] = useState<Rarity | "All">("All");
    const [activePlaylist, setActivePlaylist] = useState<string | "None">("None");
    const [addingToPlaylistCard, setAddingToPlaylistCard] = useState<string | null>(null);
    const [displayLimit, setDisplayLimit] = useState(12);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const { addCoins, coins } = useCoins();

    const refreshData = useCallback(() => {
        setCards(getCollection());
        setPlaylists(getPlaylists());
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            refreshData();
            setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [refreshData]);

    // Reset pagination when filter changes — use the setFilter/setActivePlaylist
    // wrappers instead of a useEffect to avoid set-state-in-effect lint error
    const setFilterAndReset = useCallback((newFilter: Rarity | "All") => {
        setFilter(newFilter);
        setDisplayLimit(12);
    }, []);

    const setActivePlaylistAndReset = useCallback((newPlaylist: string | "None") => {
        setActivePlaylist(newPlaylist);
        setDisplayLimit(12);
    }, []);

    // --- Derived data ---

    const filteredCards = useMemo(() => {
        return cards.filter(c => {
            const passRarity = filter === "All" || c.rarity === filter;
            const passPlaylist = activePlaylist === "None" || (playlists.find(p => p.id === activePlaylist)?.cardIds.includes(c.id));
            return passRarity && passPlaylist;
        });
    }, [cards, filter, activePlaylist, playlists]);

    const groupedCards = useMemo(() => {
        const groups: Record<string, CardGroup> = {};
        filteredCards.forEach(c => {
            const key = c.url || c.title;
            if (!groups[key]) {
                groups[key] = { card: c, ids: [] };
            }
            groups[key].ids.push(c.id);
        });

        const result = Object.values(groups);

        if (sortBy === "recent") {
            result.sort((a, b) => (b.card.addedAt || 0) - (a.card.addedAt || 0));
        } else if (sortBy === "rarity") {
            result.sort((a, b) => RARITY_SORT_ORDER[a.card.rarity] - RARITY_SORT_ORDER[b.card.rarity]);
        } else if (sortBy === "alphabetical") {
            result.sort((a, b) => a.card.title.localeCompare(b.card.title));
        }

        return result;
    }, [filteredCards, sortBy]);

    const visibleCards = useMemo(() => {
        return groupedCards.slice(0, displayLimit);
    }, [groupedCards, displayLimit]);

    // --- Handlers ---

    const handleDiscard = useCallback((card: WikiCard) => {
        if (confirm(`Discard ${card.title} for ${RARITY_SELL_VALUES[card.rarity]} WikiCoins?`)) {
            removeCard(card.id);
            addCoins(RARITY_SELL_VALUES[card.rarity]);
            logActivity('card_sold', `Sold unique card: ${card.title}`, RARITY_SELL_VALUES[card.rarity]);
            refreshData();
        }
    }, [addCoins, refreshData]);

    const handleBatchDiscard = useCallback(() => {
        const selectedCards = cards.filter(c => selectedCardIds.includes(c.id));
        const totalCoins = selectedCards.reduce((acc, c) => acc + RARITY_SELL_VALUES[c.rarity], 0);

        if (confirm(`Discard ${selectedCardIds.length} selected cards for ${totalCoins} WikiCoins?`)) {
            selectedCardIds.forEach(id => removeCard(id));
            addCoins(totalCoins);
            logActivity('card_sold', `Batch sold ${selectedCardIds.length} cards`, totalCoins);
            setSelectedCardIds([]);
            setCardSelectionMode(false);
            refreshData();
        }
    }, [cards, selectedCardIds, addCoins, refreshData]);

    const handleBatchAddToPlaylist = useCallback((playlistId: string) => {
        const newPlaylists = playlists.map(p => {
            if (p.id === playlistId) {
                const uniqueIds = Array.from(new Set([...p.cardIds, ...selectedCardIds]));
                return { ...p, cardIds: uniqueIds };
            }
            return p;
        });
        savePlaylists(newPlaylists);
        setPlaylists(newPlaylists);
        setSelectedCardIds([]);
        setCardSelectionMode(false);
    }, [playlists, selectedCardIds]);

    const toggleCardSelection = useCallback((ids: string[]) => {
        const allSelected = ids.every(id => selectedCardIds.includes(id));
        setSelectedCardIds(prev =>
            allSelected
                ? prev.filter(id => !ids.includes(id))
                : Array.from(new Set([...prev, ...ids]))
        );
    }, [selectedCardIds]);

    const handleCreatePlaylist = useCallback(() => {
        const name = prompt("Enter Cardlist folder name:");
        if (name && name.trim()) {
            const newPlaylist: Playlist = { id: Date.now().toString(), name: name.trim(), cardIds: [] };
            const newPlaylists = [...playlists, newPlaylist];
            savePlaylists(newPlaylists);
            setPlaylists(newPlaylists);
            logActivity('folder_created', `Created folder "${name.trim()}"`);
        }
    }, [playlists]);

    const handleAddToPlaylist = useCallback((playlistId: string, cardId: string) => {
        const newPlaylists = playlists.map(p => {
            if (p.id === playlistId && !p.cardIds.includes(cardId)) {
                return { ...p, cardIds: [...p.cardIds, cardId] };
            }
            return p;
        });
        savePlaylists(newPlaylists);
        setPlaylists(newPlaylists);
        setAddingToPlaylistCard(null);
    }, [playlists]);

    const handleRemoveFromPlaylist = useCallback((playlistId: string, cardId: string) => {
        const newPlaylists = playlists.map(p => {
            if (p.id === playlistId) {
                return { ...p, cardIds: p.cardIds.filter(id => id !== cardId) };
            }
            return p;
        });
        savePlaylists(newPlaylists);
        setPlaylists(newPlaylists);
    }, [playlists]);

    const toggleSelectionMode = useCallback(() => {
        setCardSelectionMode(prev => !prev);
        setSelectedCardIds([]);
    }, []);

    const loadMore = useCallback(() => {
        setDisplayLimit(prev => prev + 12);
    }, []);

    const handleExport = useCallback(() => {
        setIsExporting(true);
        try {
            const data = {
                version: "1.0",
                timestamp: Date.now(),
                cards,
                playlists,
                coins
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `wikicards-collection-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            logActivity('collection_exported', 'Exported collection to JSON');
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export collection.");
        } finally {
            setIsExporting(false);
        }
    }, [cards, playlists, coins]);

    const handleImport = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            setIsImporting(true);
            try {
                const text = await file.text();
                const data = JSON.parse(text);

                if (!data.cards || !Array.isArray(data.cards)) {
                    throw new Error("Invalid format: Missing cards array");
                }

                if (confirm(`Do you want to MERGE this import with your current collection? \n(Cancel will REPLACE your entire collection!)`)) {
                    // Merge
                    const existingCardIds = new Set(cards.map(c => c.id));
                    const newCards = data.cards.filter((c: WikiCard) => !existingCardIds.has(c.id));

                    if (newCards.length > 0) {
                        const mergedCards = [...cards, ...newCards];
                        // Save directly to raw storage to avoid the uniqueId suffix in saveCollection
                        safeSetItem("wikicards_collection", JSON.stringify(mergedCards));
                    }

                    if (data.playlists && Array.isArray(data.playlists)) {
                        const existingPlaylistIds = new Set(playlists.map(p => p.id));
                        const newPlaylists = data.playlists.filter((p: Playlist) => !existingPlaylistIds.has(p.id));
                        savePlaylists([...playlists, ...newPlaylists]);
                    }

                    if (data.coins !== undefined) {
                        safeSetItem("wikicards_coins", (coins + data.coins).toString());
                        window.dispatchEvent(new Event("coins-updated"));
                    }
                    alert(`Imported ${newCards.length} new cards.`);
                    logActivity('collection_imported', `Merged ${newCards.length} cards from import`);
                } else {
                    // Replace
                    if (confirm("ARE YOU SURE? This will DELETE all your current cards and REPLACE them with the file content.")) {
                        safeSetItem("wikicards_collection", JSON.stringify(data.cards));
                        if (data.playlists) savePlaylists(data.playlists);
                        if (data.coins !== undefined) {
                            safeSetItem("wikicards_coins", data.coins.toString());
                            window.dispatchEvent(new Event("coins-updated"));
                        }
                        alert("Collection replaced successfully.");
                        logActivity('collection_imported', 'Replaced entire collection from import');
                    }
                }
                refreshData();
            } catch (error) {
                console.error("Import failed:", error);
                alert("Failed to import collection. Is it a valid WikiCards JSON backup?");
            } finally {
                setIsImporting(false);
            }
        };
        input.click();
    }, [cards, playlists, coins, refreshData]);

    return {
        // Data
        cards,
        playlists,
        filteredCards,
        groupedCards,
        visibleCards,
        isLoading,

        // UI State
        filter,
        setFilter: setFilterAndReset,
        sortBy,
        setSortBy,
        activePlaylist,
        setActivePlaylist: setActivePlaylistAndReset,
        cardSelectionMode,
        selectedCardIds,
        addingToPlaylistCard,
        setAddingToPlaylistCard,
        displayLimit,

        // Handlers
        handleDiscard,
        handleBatchDiscard,
        handleBatchAddToPlaylist,
        toggleCardSelection,
        handleCreatePlaylist,
        handleAddToPlaylist,
        handleRemoveFromPlaylist,
        toggleSelectionMode,
        loadMore,
        handleExport,
        handleImport,
        isExporting,
        isImporting,
    };
}
