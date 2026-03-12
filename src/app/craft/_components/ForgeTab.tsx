"use client";

import { WikiCard } from "@/types";
import { Hammer, Search, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import { calculateCraftCost } from "@/lib/rarity";

interface ForgeTabProps {
    url: string;
    setUrl: (url: string) => void;
    card: WikiCard | null;
    loading: boolean;
    error: string | null;
    success: boolean;
    craftInfo: { count: number; lastReset: string };
    MAX_DAILY_CRAFTS: number;
    handlePreview: () => Promise<void>;
    handleCraft: () => void;
}

export function ForgeTab({
    url,
    setUrl,
    card,
    loading,
    error,
    success,
    craftInfo,
    MAX_DAILY_CRAFTS,
    handlePreview,
    handleCraft
}: ForgeTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start">
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
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-600/20"
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
                        Forging Costs Formula
                    </h3>
                    <div className="text-sm text-slate-300">
                        <p className="mb-2">The cost to forge a card depends on its intrinsic value (discard price) multiplied by a rarity factor:</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded-lg border border-white/5">
                                <span className="text-xs font-bold text-slate-400">Common</span>
                                <span className="text-xs font-black text-amber-500">x2</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded-lg border border-white/5">
                                <span className="text-xs font-bold text-slate-400">Uncommon</span>
                                <span className="text-xs font-black text-amber-500">x3</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded-lg border border-white/5">
                                <span className="text-xs font-bold text-slate-400">Rare</span>
                                <span className="text-xs font-black text-amber-500">x4</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded-lg border border-white/5">
                                <span className="text-xs font-bold text-slate-400">Epic</span>
                                <span className="text-xs font-black text-amber-500">x6</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded-lg border border-white/5 col-span-2">
                                <span className="text-xs font-bold text-slate-400">Legendary</span>
                                <span className="text-xs font-black text-amber-500">x8</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Preview & Craft */}
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 border border-white/5 rounded-3xl min-h-[500px] relative overflow-hidden backdrop-blur-sm">
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
                                        {calculateCraftCost(card).toLocaleString()}
                                    </div>
                                </div>

                                <div className="text-center w-full mt-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Daily Limit: <span className={craftInfo.count >= MAX_DAILY_CRAFTS ? "text-red-400" : "text-emerald-400"}>{MAX_DAILY_CRAFTS - craftInfo.count}</span> remaining
                                    </p>
                                </div>

                                <button
                                    onClick={handleCraft}
                                    disabled={craftInfo.count >= MAX_DAILY_CRAFTS}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 group disabled:cursor-not-allowed"
                                >
                                    <Hammer className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    {craftInfo.count >= MAX_DAILY_CRAFTS ? "ANVIL OVERHEATED" : "FORGE CARD"}
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
    );
}
