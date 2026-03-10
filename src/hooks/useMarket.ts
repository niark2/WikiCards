"use client";

import { useState, useEffect, useCallback } from "react";
import { WikiCard } from "@/types";
import {
    getMarketInfo,
    saveMarketInfo,
    saveCollection,
    logActivity,
    MarketInfo
} from "@/lib/storage";
import { useCoins } from "@/hooks/useCoins";
import { useToast } from "@/hooks/useToast";
import { RARITY_MARKET_PRICES } from "@/lib/rarity";

export function useMarket() {
    const [loading, setLoading] = useState(false);
    const [marketData, setMarketData] = useState<MarketInfo | null>(null);
    const [timeLeft, setTimeLeft] = useState("");
    const { coins, deductCoins } = useCoins();
    const { showToast } = useToast();

    const fetchMarket = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/market");
            const data = await res.json();
            if (data.cards) {
                const newInfo: MarketInfo = {
                    cards: data.cards,
                    boughtIds: [],
                    lastReset: new Date().toISOString()
                };
                saveMarketInfo(newInfo);
                setMarketData(newInfo);
            }
        } catch (error) {
            console.error("Failed to fetch market:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const info = getMarketInfo();
        const today = new Date().toDateString();

        if (info) {
            const lastResetDate = new Date(info.lastReset).toDateString();
            if (today === lastResetDate) {
                setMarketData(info);
            } else {
                fetchMarket();
            }
        } else {
            fetchMarket();
        }
    }, [fetchMarket]);

    // Timer logic
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        };

        const timer = setInterval(updateTimer, 1000);
        updateTimer();
        return () => clearInterval(timer);
    }, []);

    const buyCard = async (card: WikiCard) => {
        if (!marketData) return false;
        if (marketData.boughtIds.includes(card.id)) return false;

        const price = RARITY_MARKET_PRICES[card.rarity];
        if (deductCoins(price)) {
            const updatedInfo: MarketInfo = {
                ...marketData,
                boughtIds: [...marketData.boughtIds, card.id]
            };
            saveMarketInfo(updatedInfo);
            setMarketData(updatedInfo);
            saveCollection([{ ...card, obtainedFrom: "Marché Quotidien" }]);
            logActivity('card_bought', `Bought ${card.title} from the market`, price);
            showToast(`✅ ${card.title} acquis avec succès !`, "success");
            return true;
        } else {
            showToast("❌ Pas assez de WikiCoins !", "error");
            return false;
        }
    };

    return {
        loading,
        cards: marketData?.cards || [],
        boughtIds: marketData?.boughtIds || [],
        timeLeft,
        buyCard,
        coins
    };
}
