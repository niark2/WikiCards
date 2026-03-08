"use client";

import { useState } from "react";
import { WikiCard } from "@/types";
import { Card } from "@/components/Card";
import { Hammer, Search, Coins, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { saveCollection, logActivity } from "@/lib/storage";
import { fetchWikiArticle, parseWikipediaIdentifier } from "@/lib/wiki";
import { RARITY_CRAFT_COSTS } from "@/lib/rarity";
import { motion, AnimatePresence } from "framer-motion";

export default function CraftPage() {
    const [url, setUrl] = useState("");
    const [card, setCard] = useState<WikiCard | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { deductCoins, addCoins } = useCoins();

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
        } finally {
            setLoading(false);
        }
    };

    const handleCraft = () => {
        if (!card) return;
        const price = RARITY_CRAFT_COSTS[card.rarity];

        if (deductCoins(price)) {
            // Generate a unique instance ID while keeping the same card data
            const craftedCard = { ...card, id: `${card.id}-${Date.now()}` };
            saveCollection([craftedCard]);
            logActivity('card_crafted', `Crafted card: ${card.title}`, -price);
            setSuccess(true);
            setCard(null);
            setUrl("");
        } else {
            setError("Not enough WikiCoins to craft this card.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden pt-24 pb-20">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-12 border-b border-white/5 pb-8">
                    <h1 className="text-4xl font-serif font-bold text-white mb-2 flex items-center gap-3">
                        <Hammer className="text-amber-500 w-8 h-8" />
                        Card Forging
                    </h1>
                    <p className="text-slate-400">
                        Sacrifice your WikiCoins to manifest specific knowledge into your collection.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Input & Info */}
                    <div className="space-y-8">
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                                Wikipedia URL or Article Title
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://en.wikipedia.org/wiki/..."
                                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all pl-12"
                                    onKeyDown={(e) => e.key === 'Enter' && handlePreview()}
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                            </div>

                            <button
                                onClick={handlePreview}
                                disabled={loading || !url}
                                className="w-full mt-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Preview Card
                                    </>
                                )}
                            </button>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm"
                                    >
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p>{error}</p>
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 font-bold"
                                    >
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        Card successfully forged and added to collection!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                Forging Costs
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(RARITY_CRAFT_COSTS).map(([rarity, price]) => (
                                    <div key={rarity} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-white/5">
                                        <span className="text-xs font-bold text-slate-400">{rarity}</span>
                                        <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                                            <Coins className="w-3 h-3" /> {price.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Preview & Craft */}
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 border border-white/5 rounded-3xl min-h-[500px] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {card ? (
                                <motion.div
                                    key="card-preview"
                                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                    transition={{ type: "spring", damping: 12 }}
                                    className="flex flex-col items-center gap-8 z-10"
                                >
                                    <Card card={card} />

                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <div className="flex items-center gap-3 bg-slate-800 px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
                                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Cost:</span>
                                            <div className="flex items-center gap-2 text-2xl font-black text-amber-500">
                                                <Coins className="w-6 h-6" />
                                                {RARITY_CRAFT_COSTS[card.rarity].toLocaleString()}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCraft}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                                        >
                                            <Hammer className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                            FORGE CARD
                                        </button>
                                    </div>
                                </motion.div>
                            ) : !loading && !success && (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                                        <Hammer className="w-10 h-10 text-slate-600" />
                                    </div>
                                    <h3 className="text-xl font-serif text-slate-300">Anvil is Waiting</h3>
                                    <p className="text-slate-500 max-w-[250px]">
                                        Enter a Wikipedia article above to preview its card before forging.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
