"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWikiArticle } from "@/lib/wiki/api";
import { WikiCard } from "@/types";
import { Card } from "@/components/Card";
import { ArrowLeft, ExternalLink, Eye, Coins, Sparkles, BookOpen, History as HistoryIcon } from "lucide-react";
import { formatViews } from "@/lib/format";
import { calculateCardValue } from "@/lib/rarity";

export default function CardProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [card, setCard] = useState<WikiCard | null>(null);
    const [collectionInfo, setCollectionInfo] = useState<{ addedAt?: number; obtainedFrom?: string; count: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadCard = async () => {
            try {
                // Fetch details from Wikipedia
                const data = await fetchWikiArticle(id, true);
                if (data) {
                    setCard(data);

                    // Check if this card exists in the user's collection
                    if (typeof window !== 'undefined') {
                        const collectionStr = localStorage.getItem('wikicards_collection');
                        if (collectionStr) {
                            const collection: WikiCard[] = JSON.parse(collectionStr);
                            // Match by wikiId or title
                            const matches = collection.filter(c =>
                                (c.wikiId === id) || (c.id === id) || (c.title === data.title)
                            );

                            if (matches.length > 0) {
                                // Sort matches by date to get the most recent one
                                const sorted = matches.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
                                setCollectionInfo({
                                    addedAt: sorted[0].addedAt,
                                    obtainedFrom: sorted[0].obtainedFrom,
                                    count: matches.length
                                });
                            }
                        }
                    }
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to load card details:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        loadCard();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-medium animate-pulse">Initializing Portal...</p>
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-slate-700" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 font-serif">Asset Not Found</h1>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    The requested knowledge asset is currently unavailable in our archives.
                </p>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-white text-slate-950 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                >
                    Return to Collection
                </button>
            </div>
        );
    }

    const sellValue = calculateCardValue(card);

    const acquisitionDate = collectionInfo?.addedAt
        ? new Date(collectionInfo.addedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden selection:bg-indigo-500/30 font-sans">
            {/* Immersive Cinematic Background */}
            <div className="absolute inset-0 z-0">
                {card.imageUrl && (
                    <>
                        <img
                            src={card.imageUrl}
                            alt=""
                            className="w-full h-full object-cover opacity-10 blur-[120px] scale-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617]" />
                    </>
                )}
                {/* Orbital Glows */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] opacity-10 rounded-full animate-pulse-slow
                    ${card.rarity === 'Legendary' ? 'bg-yellow-500/30' :
                        card.rarity === 'Epic' ? 'bg-fuchsia-500/30' :
                            card.rarity === 'Rare' ? 'bg-blue-500/30' :
                                card.rarity === 'Uncommon' ? 'bg-emerald-500/30' :
                                    'bg-indigo-500/30'}`}
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 min-h-screen flex flex-col px-4 md:px-8 max-w-7xl mx-auto">
                {/* Minimal Header */}
                <div className="h-20 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-4 text-slate-500 hover:text-white transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] hidden md:block text-slate-500">Dismiss Portal</span>
                    </button>

                    <div />
                </div>

                {/* Main Content - Balanced position */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-24 pt-12 md:pt-16 lg:pt-20">
                    {/* The Artifact Area */}
                    <div className="relative group animate-in zoom-in-95 fade-in duration-1000 delay-200">
                        {/* Dramatic Lighting beneath card */}
                        <div className={`absolute -inset-10 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000
                            ${card.rarity === 'Legendary' ? 'bg-yellow-400' :
                                card.rarity === 'Epic' ? 'bg-fuchsia-400' :
                                    card.rarity === 'Rare' ? 'bg-blue-400' :
                                        card.rarity === 'Uncommon' ? 'bg-emerald-400' :
                                            'bg-indigo-400'}`}
                        />

                        <div className="scale-100 md:scale-105 lg:scale-110 transition-transform duration-700">
                            <Card card={card} isRevealed={true} hideLink={true} />
                        </div>
                    </div>

                    {/* Metadata Area */}
                    <div className="flex flex-col max-w-xl animate-in slide-in-from-right-12 fade-in duration-1000 delay-300">
                        {/* Rarity Badge Small */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-12 h-[1px] ${card.rarity === 'Legendary' ? 'bg-yellow-500' : card.rarity === 'Epic' ? 'bg-fuchsia-500' : 'bg-indigo-500'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${getRarityColor(card.rarity)}`}>
                                {card.rarity} Classification
                            </span>
                        </div>

                        {/* Huge Minimal Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-5xl font-black font-serif text-white leading-[1.1] tracking-tight mb-8 drop-shadow-2xl">
                            {card.title}
                        </h1>

                        {/* More Compact Redesigned Stats Cards */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="flex flex-col gap-3 p-4 md:p-5 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md group/stat hover:bg-white/[0.06] transition-all hover:scale-[1.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover/stat:text-indigo-400 transition-colors">Global Impact</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl md:text-2xl font-black font-serif text-white tracking-tight">{formatViews(card.views)}</span>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Views</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 p-4 md:p-5 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md group/stat hover:bg-white/[0.06] transition-all hover:scale-[1.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                        <Coins className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover/stat:text-amber-400 transition-colors">Asset Liquidity</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl md:text-2xl font-black font-serif text-amber-500 tracking-tight">{sellValue}</span>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">WikiCoins</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acquisition Records */}
                        {collectionInfo && (
                            <div className="flex flex-col gap-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                                <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                                <div className="flex flex-wrap gap-8">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <HistoryIcon className="w-3 h-3" />
                                            Acquisition Date
                                        </div>
                                        <span className="text-white font-serif font-black">{acquisitionDate}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <Sparkles className="w-3 h-3" />
                                            Provenance
                                        </div>
                                        <span className="text-white font-serif font-black">{collectionInfo.obtainedFrom || 'Unknown Source'}</span>
                                    </div>
                                    {collectionInfo.count > 1 && (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                In Possession
                                            </div>
                                            <span className="text-indigo-400 font-serif font-black">{collectionInfo.count} exemplaires</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Minimal Actions */}
                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href={card.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative px-8 py-4 bg-white text-slate-950 rounded-full font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:pr-12 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                            >
                                <span className="relative z-10 transition-all flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Explore Source
                                </span>
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </div>
                            </a>

                            <button
                                onClick={() => router.back()}
                                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
                            >
                                Back to Vault
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.15; transform: translate(-50%, -50%) scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

function getRarityColor(rarity: string) {
    if (rarity === 'Legendary') return 'text-yellow-500';
    if (rarity === 'Epic') return 'text-fuchsia-500';
    if (rarity === 'Rare') return 'text-blue-500';
    if (rarity === 'Uncommon') return 'text-emerald-500';
    return 'text-indigo-500';
}
