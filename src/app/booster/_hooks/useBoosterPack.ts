"use client";

import { useState, useEffect, useCallback } from "react";
import { WikiCard } from "@/types";
import { saveCollection, logActivity, getDailyBoosterInfo, incrementDailyBooster, removeCard } from "@/lib/storage";
import { calculateCardValue } from "@/lib/rarity";
import { useCoins } from "@/hooks/useCoins";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/useToast";

export interface BoosterTheme {
    id: string;
    label: string;
    color: string;
    dark: string;
    light: string;
    category?: 'classic' | 'thematic' | 'ephemeral';
    cost?: number;
    icon?: string;
    description?: string;
}

export const THEMES: BoosterTheme[] = [
    { id: "", label: "Standard Edition", color: "#e2e8f0", dark: "#64748b", light: "#ffffff", category: 'classic', cost: 30, icon: "Sparkles", description: "All categories" },
    { id: "iron", label: "Iron Edition", color: "#64748b", dark: "#334155", light: "#94a3b8", category: 'classic', cost: 80, icon: "Shield", description: "Tech & Industry" },

    { id: "golden", label: "Golden Edition", color: "#eab308", dark: "#b45309", light: "#fde047", category: 'classic', cost: 300, icon: "Trophy", description: "Rare cards guaranteed" },
    { id: "uranium", label: "Uranium Edition", color: "#22c55e", dark: "#14532d", light: "#4ade80", category: 'classic', cost: 900, icon: "Zap", description: "100% Epic or higher" },
];

const FREE_LIMIT = 3;

export function useBoosterPack() {
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<WikiCard[] | null>(null);
    const [revealed, setRevealed] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedThemeId, setSelectedThemeId] = useState("");
    const [dailyInfo, setDailyInfo] = useState({ count: 0, lastReset: "" });
    const { coins, deductCoins, addCoins } = useCoins();
    const { playRevealSound } = useSound();
    const { showToast } = useToast();
    const [availableThemes, setAvailableThemes] = useState<BoosterTheme[]>(THEMES);

    useEffect(() => {
        setDailyInfo(getDailyBoosterInfo());

        // Fetch all available boosters (including dynamic ephemeral ones)
        const fetchAvailableBoosters = async () => {
            try {
                const res = await fetch(`/api/booster/list`);
                const data = await res.json();
                if (data.success && data.boosters) {
                    // Classic themes are the ones in hardcoded THEMES without 'ephemeral' category
                    const classicThemes = THEMES.filter(t => t.category !== 'ephemeral');
                    setAvailableThemes([...classicThemes, ...data.boosters]);
                }
            } catch (e) {
                console.error("Failed to fetch boosters list", e);
            }
        }
        fetchAvailableBoosters();
    }, []);

    const selectedTheme = availableThemes.find(t => t.id === selectedThemeId) || availableThemes[0];

    const isStandardFree = selectedThemeId === "" && dailyInfo.count < FREE_LIMIT;
    const cost = isStandardFree ? 0 : (selectedTheme.cost || 0);

    const freeRemaining = FREE_LIMIT - dailyInfo.count;

    const revealCardsSequentially = useCallback((newCards: WikiCard[]) => {
        newCards.forEach((card, index) => {
            setTimeout(() => {
                setRevealed(prev => [...prev, index]);
                playRevealSound(card.rarity);
            }, 500 + index * 600);
        });
    }, [playRevealSound]);

    const openBooster = useCallback(async () => {
        // Pre-check balance without deducting yet
        if (cost > 0 && coins < cost) {
            showToast("❌ Not enough WikiCoins!", "error");
            return;
        }

        setLoading(true);
        setCards(null);
        setRevealed([]);
        setCurrentIndex(0);

        try {
            const res = await fetch(`/api/booster${selectedThemeId ? `?theme=${encodeURIComponent(selectedThemeId)}` : ""}`);

            if (!res.ok) {
                throw new Error("Failed to fetch booster pack from server.");
            }

            const data = await res.json();

            if (data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
                // Now that we have the cards, deduct the coins
                if (cost > 0) {
                    const success = deductCoins(cost);
                    if (!success) {
                        showToast("❌ Not enough WikiCoins!", "error");
                        setLoading(false);
                        return;
                    }
                }

                const articles = (data.cards as WikiCard[]).map(c => ({
                    ...c,
                    obtainedFrom: `Booster ${selectedTheme.label}`
                })).filter(c => !c.isCoinValue);
                const savedCards = saveCollection(articles);

                // Merge back with coin cards and use the saved version (with unique IDs)
                const finalCards = (data.cards as WikiCard[]).map(c => {
                    if (c.isCoinValue) return c;
                    return savedCards.find(sc => sc.wikiId === (c.wikiId || c.id)) || c;
                });

                setCards(finalCards);

                if (selectedThemeId === "") {
                    incrementDailyBooster();
                    setDailyInfo(getDailyBoosterInfo());
                }

                logActivity('booster_opened', `Opened a ${selectedTheme.label}`, cost);

                (data.cards as WikiCard[]).forEach(c => {
                    if (c.isCoinValue) {
                        addCoins(c.isCoinValue);
                        logActivity('coins_added', `Found ${c.isCoinValue} WikiCoins in a booster`, c.isCoinValue);
                        showToast(`💰 You found ${c.isCoinValue} WikiCoins!`, "success");
                    }
                });

                revealCardsSequentially(data.cards);
            } else {
                throw new Error("Booster pack generation failed or returned empty.");
            }
        } catch (e) {
            console.error(e);
            showToast("❌ Error opening booster", "error");
        } finally {
            setLoading(false);
        }
    }, [cost, coins, deductCoins, selectedThemeId, selectedTheme.label, addCoins, revealCardsSequentially, showToast]);

    const resetPack = useCallback(() => {
        setCards(null);
    }, []);

    const goToPreviousCard = useCallback(() => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    }, []);

    const goToNextCard = useCallback(() => {
        if (!cards) return;
        setCurrentIndex(prev => Math.min(cards.length - 1, prev + 1));
    }, [cards]);

    const sellCards = useCallback((cardsToSell: WikiCard[]) => {
        if (!cardsToSell.length) return;

        const totalValue = cardsToSell.reduce((acc, c) => acc + calculateCardValue(c), 0);

        if (confirm(`Sell ${cardsToSell.length} cards for ${totalValue} WikiCoins?`)) {
            cardsToSell.forEach(c => removeCard(c.id));
            addCoins(totalValue);
            logActivity('card_sold', `Sold ${cardsToSell.length} cards from booster`, totalValue);
            showToast(`✅ Sold for ${totalValue} WikiCoins`, 'success');

            // If we sold everything, reset
            if (cards && cardsToSell.length === cards.filter(c => !c.isCoinValue).length) {
                setCards(null);
            } else {
                // Remove sold cards from the current view
                setCards(prev => prev ? prev.filter(c => !cardsToSell.find(ts => ts.id === c.id)) : null);
                setCurrentIndex(0);
            }
        }
    }, [addCoins, showToast, cards]);

    const sellAll = useCallback(() => {
        if (!cards) return;
        const toSell = cards.filter(c => !c.isCoinValue);
        sellCards(toSell);
    }, [cards, sellCards]);

    const sellCommon = useCallback(() => {
        if (!cards) return;
        const toSell = cards.filter(c => !c.isCoinValue && c.rarity === "Common");
        sellCards(toSell);
    }, [cards, sellCards]);

    return {
        // State
        loading,
        cards,
        revealed,
        currentIndex,
        setCurrentIndex,
        selectedThemeId,
        setSelectedThemeId,
        availableThemes,
        selectedTheme,
        cost,
        isStandardFree,
        freeRemaining,
        coins,

        // Handlers
        openBooster,
        resetPack,
        goToPreviousCard,
        goToNextCard,
        sellAll,
        sellCommon,
    };
}
