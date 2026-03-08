"use client";

import { useState, useEffect } from "react";
import { safeGetItem, safeSetItem, isClientSide } from "@/lib/safe-storage";

const COINS_KEY = "wikicards_coins";
const STARTING_COINS = 150;

const getCoinsFromStorage = (): number => {
    const val = safeGetItem(COINS_KEY);
    return val ? parseInt(val, 10) : STARTING_COINS;
};

const setCoinsToStorage = (amount: number): void => {
    safeSetItem(COINS_KEY, amount.toString());
    if (isClientSide()) {
        window.dispatchEvent(new Event("coins-updated"));
    }
};

export function useCoins() {
    // Lazy initializer: runs once on mount, avoids set-state-in-effect
    const [coins, setCoins] = useState<number>(() => getCoinsFromStorage());

    useEffect(() => {
        const handleUpdate = () => {
            setCoins(getCoinsFromStorage());
        };

        window.addEventListener("coins-updated", handleUpdate);

        const handleStorage = (e: StorageEvent) => {
            if (e.key === COINS_KEY) handleUpdate();
        };
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("coins-updated", handleUpdate);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const addCoins = (amount: number): void => {
        const newTotal = getCoinsFromStorage() + amount;
        setCoinsToStorage(newTotal);
    };

    const deductCoins = (amount: number): boolean => {
        const current = getCoinsFromStorage();
        if (current >= amount) {
            setCoinsToStorage(current - amount);
            return true;
        }
        return false;
    };

    return { coins, addCoins, deductCoins };
}
