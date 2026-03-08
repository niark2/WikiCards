"use client";

import { motion } from "framer-motion";
import { useMarket } from "@/hooks/useMarket";
import { MarketCard } from "./_components/MarketCard";
import { ShoppingBag, Timer, RefreshCw } from "lucide-react";

export default function MarketPage() {
    const market = useMarket();

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-8 pt-24 w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24 relative">
                    <div className="flex flex-col gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px]"
                        >
                            <div className="w-12 h-px bg-indigo-500/30" />
                            Market Archives
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl md:text-8xl font-serif font-black tracking-tighter leading-[0.85]"
                        >
                            Daily <span className="text-indigo-500/80">Item</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 max-w-md font-medium text-lg leading-relaxed mt-2"
                        >
                            An ephemeral selection of Wikipedia knowledge.
                            Grab them before they fade away.
                        </motion.p>
                    </div>

                    {/* Timer Display - Minimalist */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-end gap-0.5"
                    >
                        <div className="flex items-center gap-2 text-slate-500 font-black uppercase tracking-widest text-[9px] mb-2 opacity-60">
                            <Timer className="w-3 h-3" />
                            Refreshing in
                        </div>
                        <div className="text-5xl font-black font-mono text-white tracking-[0.2em] tabular-nums">
                            {market.timeLeft}
                        </div>
                        <div className="w-full h-0.5 bg-slate-800/30 mt-4 overflow-hidden relative">
                            <motion.div
                                className="absolute top-0 right-0 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 86400, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Grid display */}
                {market.loading ? (
                    <div className="w-full py-40 flex flex-col items-center justify-center gap-8">
                        <div className="relative">
                            <div className="w-20 h-20 border-[1px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-indigo-400/50 animate-pulse" />
                            </div>
                        </div>
                        <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                            Synchronizing archives...
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 pb-40"
                    >
                        {market.cards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <MarketCard
                                    card={card}
                                    isBought={market.boughtIds.includes(card.id)}
                                    onBuy={market.buyCard}
                                    userCoins={market.coins}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
