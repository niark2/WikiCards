"use client";

import { WikiCard } from "@/types";
import { RarityBadge } from "./RarityBadge";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { memo } from "react";
import { formatViews } from "@/lib/format";

interface CardProps {
    card: WikiCard;
    isRevealed?: boolean;
    count?: number;
    hideLink?: boolean;
}

const borderColors = {
    Common: "border-slate-700",
    Uncommon: "border-emerald-500/50",
    Rare: "border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    Epic: "border-fuchsia-500/70 shadow-[0_0_20px_rgba(217,70,239,0.4)]",
    Legendary: "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]",
};

const holoLayers = {
    Common: "",
    Uncommon: "",
    Rare: "holo-rare",
    Epic: "holo-epic",
    Legendary: "holo-legendary",
};

export const Card = memo(function Card({ card, isRevealed = true, count = 1, hideLink = false }: CardProps) {
    if (!isRevealed) {
        return (
            <div className="w-64 h-96 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center flex-col gap-4 shadow-xl">
                <div className="w-16 h-24 border border-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-4xl text-slate-700 font-serif">W</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-64 h-96 rounded-2xl bg-slate-900 relative border-2 flex flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-2 transform-gpu card ${borderColors[card.rarity]}`}>
            {/* Holographic Layer */}
            <div className={`absolute inset-0 z-20 pointer-events-none holo-overlay ${holoLayers[card.rarity]}`} />

            {/* Header / Rarity */}
            <div className="p-3 pb-2 z-30 bg-gradient-to-b from-slate-950/80 to-transparent flex justify-between items-start absolute w-full top-0">
                {count > 1 && (
                    <div className="px-2 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-black shadow-lg border border-white/20 animate-in zoom-in-75 duration-300">
                        x{count}
                    </div>
                )}
                <div className="flex-1 text-right">
                    <RarityBadge rarity={card.rarity} />
                </div>
            </div>

            {/* Image Area */}
            <div className="h-40 w-full bg-slate-800 relative z-0 flex rounded-b-2xl overflow-hidden shadow-inner">
                {card.isCoinValue ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-400/20 to-amber-600/30 text-amber-400">
                        <div className="w-20 h-20 rounded-full bg-amber-500/20 border-4 border-amber-500/50 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            <Eye className="w-12 h-12 text-amber-500" />
                        </div>
                    </div>
                ) : card.imageUrl ? (
                    <Image src={card.imageUrl} alt={card.title} fill className="object-cover opacity-80" unoptimized />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600 font-serif text-5xl">W</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col z-10 bg-slate-900">
                <h3
                    className={`font-serif font-bold leading-tight mb-2 line-clamp-2 ${card.title.length > 50 ? 'text-sm' :
                        card.title.length > 35 ? 'text-base' :
                            card.title.length > 20 ? 'text-lg' :
                                'text-xl'
                        }`}
                    title={card.title}
                >
                    {card.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-4 flex-1 leading-relaxed">
                    {card.extract}
                </p>

                {/* Footer Stats */}
                {!card.isCoinValue && (
                    <div className="pt-3 mt-auto border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1" title="Monthly Views">
                            <Eye className="w-3.5 h-3.5" />
                            {formatViews(card.views)}
                        </div>
                        {!hideLink && (
                            <Link href={`/card/${card.wikiId || card.id}`} className="text-indigo-400 hover:text-indigo-300 font-bold transition-all hover:scale-105 active:scale-95 z-30 relative">
                                View Details
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});
