"use client";

import { useState, useEffect } from "react";
import { WikiCard } from "@/types";
import { Hammer, Sparkles } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/useToast";
import { logActivity, getDailyCraftInfo, incrementDailyCraft, saveCollection } from "@/lib/storage";
import { fetchWikiArticle, parseWikipediaIdentifier } from "@/lib/wiki";
import { calculateCraftCost } from "@/lib/rarity";
import { ForgeTab } from "./_components/ForgeTab";
import { FusionTab } from "./_components/FusionTab";

const MAX_DAILY_CRAFTS = 3;

export default function CraftPage() {
    const [activeTab, setActiveTab] = useState<'forge' | 'fusion'>('forge');
    const [url, setUrl] = useState("");
    const [card, setCard] = useState<WikiCard | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [craftInfo, setCraftInfo] = useState({ count: 0, lastReset: "" });
    const { deductCoins } = useCoins();
    const { playForgeSound } = useSound();
    const { showToast } = useToast();

    useEffect(() => {
        setCraftInfo(getDailyCraftInfo());
    }, []);

    const handlePreview = async () => {
        if (!url) return;

        setLoading(true);
        setError(null);
        setCard(null);
        setSuccess(false);

        try {
            const title = parseWikipediaIdentifier(url);
            const data = await fetchWikiArticle(title);
            if (data) {
                setCard(data);
            } else {
                setError("Could not find this Wikipedia article. Make sure the URL or Title is correct.");
            }
        } catch {
            setError("An error occurred while fetching the article.");
            showToast("❌ Could not find the article", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCraft = () => {
        if (!card) return;

        if (craftInfo.count >= MAX_DAILY_CRAFTS) {
            setError(`Daily forge limit reached. The anvil is cooling down... Try again tomorrow!`);
            showToast("❌ Daily limit reached", "error");
            return;
        }

        const price = calculateCraftCost(card);

        if (deductCoins(price)) {
            const craftedCard: WikiCard = {
                ...card,
                id: `${card.id}-${Date.now()}`,
                obtainedFrom: "Forged in the Forge"
            };
            saveCollection([craftedCard]);
            incrementDailyCraft();
            setCraftInfo(getDailyCraftInfo());
            logActivity('card_crafted', `Crafted card: ${card.title}`, -price);
            playForgeSound();
            setSuccess(true);
            showToast(`✅ ${card.title} successfully forged!`, "success");
            setCard(null);
            setUrl("");
        } else {
            setError("Not enough WikiCoins to craft this card.");
            showToast("❌ Not enough WikiCoins", "error");
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden pt-20 md:pt-24 pb-20">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-2xl md:text-5xl font-serif font-black text-white mb-2 flex items-center gap-4">
                            <span className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/20">
                                <Hammer className="text-indigo-400 w-8 h-8 md:w-10 md:h-10" />
                            </span>
                            Mystic Forge
                        </h1>
                        <p className="text-slate-400 font-medium">
                            Sacrifice coins or cards to manifest knowledge into existence.
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="bg-slate-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 flex gap-1 shadow-2xl">
                        <button
                            onClick={() => setActiveTab('forge')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'forge' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Hammer className="w-4 h-4" /> Forging
                        </button>
                        <button
                            onClick={() => setActiveTab('fusion')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'fusion' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Sparkles className="w-4 h-4" /> Fusion
                        </button>
                    </div>
                </div>

                {activeTab === 'forge' ? (
                    <ForgeTab 
                        url={url}
                        setUrl={setUrl}
                        card={card}
                        loading={loading}
                        error={error}
                        success={success}
                        craftInfo={craftInfo}
                        MAX_DAILY_CRAFTS={MAX_DAILY_CRAFTS}
                        handlePreview={handlePreview}
                        handleCraft={handleCraft}
                    />
                ) : (
                    <FusionTab />
                )}
            </div>
        </div>
    );
}
