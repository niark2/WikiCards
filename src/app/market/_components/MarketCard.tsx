"use client";

import { WikiCard } from "@/types";
import { Card } from "@/components/Card";
import { Coins, CheckCircle2 } from "lucide-react";
import { RARITY_MARKET_PRICES } from "@/lib/rarity";
import { motion } from "framer-motion";

interface MarketCardProps {
    card: WikiCard;
    isBought: boolean;
    onBuy: (card: WikiCard) => void;
    userCoins: number;
}

export function MarketCard({ card, isBought, onBuy, userCoins }: MarketCardProps) {
    const price = RARITY_MARKET_PRICES[card.rarity];
    const canAfford = userCoins >= price;

    return (
        <div className="flex flex-col items-center gap-6 group/market">
            <div className="relative group/card-container">
                <Card card={card} />

                {/* Buy Button Overlay on Hover (only if not bought) */}
                {!isBought && (
                    <div className="absolute inset-0 z-40 bg-slate-950/0 group-hover/card-container:bg-slate-950/20 backdrop-blur-none group-hover/card-container:backdrop-blur-[2px] rounded-2xl transition-all duration-300 flex items-center justify-center">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            whileHover={canAfford ? { scale: 1.05 } : {}}
                            whileTap={canAfford ? { scale: 0.95 } : {}}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: { delay: 0.1 }
                            }}
                            className="group-hover/card-container:flex hidden" // Only show on hover for cleaner look
                            onClick={(e) => {
                                e.stopPropagation();
                                onBuy(card);
                            }}
                            disabled={!canAfford}
                        >
                            <div className={`
                                flex items-center gap-3 px-6 py-3 rounded-full font-black text-xs uppercase tracking-[0.15em] shadow-2xl transition-all
                                ${canAfford
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/40 ring-1 ring-white/20'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-80'
                                }
                            `}>
                                <Coins className={`w-4 h-4 ${canAfford ? 'text-amber-400 animate-pulse' : ''}`} />
                                {price} Coins
                            </div>
                        </motion.button>
                    </div>
                )}

                {isBought && (
                    <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <span className="font-serif font-black uppercase tracking-tighter text-emerald-400/90 text-2xl drop-shadow-lg">Sold</span>
                    </div>
                )}
            </div>

            {/* Permanent price indicator below card (optional, but good for UX if button is hover-only) */}
            <div className={`
                flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all
                ${isBought
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500/60'
                    : 'border-white/5 bg-white/5 text-slate-400 group-hover/market:border-indigo-500/30 group-hover/market:text-indigo-300'
                }
            `}>
                {isBought ? (
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> In collection</span>
                ) : (
                    <span className="flex items-center gap-1.5"><Coins className="w-3 h-3 text-amber-500/80" /> {price} WikiCoins</span>
                )}
            </div>
        </div>
    );
}
