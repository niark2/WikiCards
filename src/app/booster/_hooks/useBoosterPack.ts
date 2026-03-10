"use client";

import { useState, useEffect, useCallback } from "react";
import { WikiCard } from "@/types";
import { saveCollection, logActivity, getDailyBoosterInfo, incrementDailyBooster } from "@/lib/storage";
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
    { id: "", label: "Standard Edition", color: "#e2e8f0", dark: "#64748b", light: "#ffffff", category: 'classic', cost: 20, icon: "Sparkles", description: "All categories" },
    { id: "iron", label: "Iron Edition", color: "#64748b", dark: "#334155", light: "#94a3b8", category: 'classic', cost: 80, icon: "Shield", description: "Tech & Industry" },
    { id: "history", label: "History Edition", color: "#78350f", dark: "#451a03", light: "#92400e", category: 'thematic', cost: 120, icon: "Scroll", description: "Events & Figures" },
    { id: "science", label: "Science Edition", color: "#0284c7", dark: "#075985", light: "#38bdf8", category: 'thematic', cost: 120, icon: "Atom", description: "Knowledge & Discovery" },
    { id: "art", label: "Art Edition", color: "#9333ea", dark: "#581c87", light: "#c084fc", category: 'thematic', cost: 120, icon: "Palette", description: "Creativity & Works" },
    { id: "golden", label: "Golden Edition", color: "#eab308", dark: "#b45309", light: "#fde047", category: 'classic', cost: 200, icon: "Trophy", description: "Rare cards guaranteed" },
    { id: "uranium", label: "Uranium Edition", color: "#22c55e", dark: "#14532d", light: "#4ade80", category: 'classic', cost: 450, icon: "Zap", description: "100% Epic or higher" },
];

const FREE_LIMIT = 5;

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
            showToast("❌ Pas assez de WikiCoins !", "error");
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
                        showToast("❌ Pas assez de WikiCoins !", "error");
                        setLoading(false);
                        return;
                    }
                }

                setCards(data.cards);

                const articles = (data.cards as WikiCard[]).map(c => ({
                    ...c,
                    obtainedFrom: `Booster ${selectedTheme.label}`
                })).filter(c => !c.isCoinValue);
                saveCollection(articles);

                if (selectedThemeId === "") {
                    incrementDailyBooster();
                    setDailyInfo(getDailyBoosterInfo());
                }

                logActivity('booster_opened', `Opened a ${selectedTheme.label}`, cost);

                (data.cards as WikiCard[]).forEach(c => {
                    if (c.isCoinValue) {
                        addCoins(c.isCoinValue);
                        logActivity('coins_added', `Found ${c.isCoinValue} WikiCoins in a booster`, c.isCoinValue);
                        showToast(`💰 Vous avez trouvé ${c.isCoinValue} WikiCoins !`, "success");
                    }
                });

                revealCardsSequentially(data.cards);
            } else {
                throw new Error("Booster pack generation failed or returned empty.");
            }
        } catch (e) {
            console.error(e);
            showToast("❌ Erreur lors de l'ouverture du booster", "error");
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
    };
}
