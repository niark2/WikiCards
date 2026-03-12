"use client";

import { WikiCard, Rarity } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { Hammer, Sparkles, X, Coins, RefreshCw, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { Card } from "@/components/Card";
import { motion, AnimatePresence } from "framer-motion";
import { getCollection, removeCard, saveCollection, logActivity } from "@/lib/storage";
import { generateNaturalCard } from "@/lib/wiki/booster";
import { useCoins } from "@/hooks/useCoins";
import { useToast } from "@/hooks/useToast";
import { useSound } from "@/hooks/useSound";
import { RARITY_COLORS } from "@/lib/rarity";

const SACRIFICE_COUNT = 5;
const REROLL_BASE_COST = 25;

const NEXT_RARITY: Record<Rarity, Rarity | null> = {
    "Common": "Uncommon",
    "Uncommon": "Rare",
    "Rare": "Epic",
    "Epic": "Legendary",
    "Legendary": null // Cannot upgrade legendary
};

export function FusionTab() {
    const [collection, setCollection] = useState<WikiCard[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [proposal, setProposal] = useState<WikiCard | null>(null);
    const [rerollCount, setRerollCount] = useState(0);
    const [isFusing, setIsFusing] = useState(false);
    const [success, setSuccess] = useState(false);

    const { coins, deductCoins } = useCoins();
    const { showToast } = useToast();
    const { playForgeSound, playRevealSound, playCoinSound } = useSound();

    const [search, setSearch] = useState("");
    const [rarityFilter, setRarityFilter] = useState<Rarity | 'All'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        setCollection(getCollection());
    }, []);

    const selectedRarity = useMemo(() => {
        if (selectedIds.length === 0) return null;
        const firstCard = collection.find(c => c.id === selectedIds[0]);
        return firstCard?.rarity || null;
    }, [selectedIds, collection]);

    // Update rarity filter automatically when first card is selected
    useEffect(() => {
        if (selectedRarity) {
            setRarityFilter(selectedRarity);
        } else {
            setRarityFilter('All');
        }
        setCurrentPage(1);
    }, [selectedRarity]);

    const targetRarity = selectedRarity ? NEXT_RARITY[selectedRarity] : null;

    const renderSlot = (i: number, className = "") => {
        const card = collection.find(c => c.id === selectedIds[i]);
        const rarityColor = card ? RARITY_COLORS[card.rarity] : 'transparent';
        return (
            <div 
                key={i} 
                className={`aspect-[2/3] w-18 rounded-xl border-2 flex items-center justify-center relative transition-all duration-500 ${card ? 'border-solid shadow-lg scale-105 bg-slate-900/50' : 'border-dashed border-slate-800 bg-slate-800/10'} ${className}`}
                style={{ 
                    borderColor: card ? rarityColor : undefined,
                    boxShadow: card ? `0 0 20px ${rarityColor}33` : undefined
                }}
            >
                {card ? (
                    <>
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                            <div className="scale-[0.27] transform-gpu">
                                <Card card={card} />
                            </div>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFromId(card.id);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 text-white hover:bg-red-600 transition-all shadow-xl z-30 border-2 border-slate-900"
                        >
                            <X className="w-2.5 h-2.5 font-bold" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-1 opacity-10">
                        <Hammer className="w-4 h-4" />
                        <span className="text-[10px] font-black">{i + 1}</span>
                    </div>
                )}
            </div>
        );
    };

    const groupedCards = useMemo(() => {
        let base = collection;
        
        // Mandatory filter if cards are already selected
        if (selectedRarity) {
            base = collection.filter(c => c.rarity === selectedRarity);
        } else if (rarityFilter !== 'All') {
            base = collection.filter(c => c.rarity === rarityFilter);
        } else {
            // By default, hide legendary since they can't be fused
            base = collection.filter(c => NEXT_RARITY[c.rarity] !== null);
        }

        if (search) {
            base = base.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
        }
        
        // Group by wikiId or title
        const map = new Map<string, WikiCard[]>();
        base.forEach(card => {
            const key = card.wikiId || card.title;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(card);
        });

        return Array.from(map.values());
    }, [collection, selectedRarity, rarityFilter, search]);

    const totalPages = Math.ceil(groupedCards.length / ITEMS_PER_PAGE);
    const paginatedGroups = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return groupedCards.slice(start, start + ITEMS_PER_PAGE);
    }, [groupedCards, currentPage]);

    const addFromGroup = (group: WikiCard[]) => {
        const availableCard = group.find(c => !selectedIds.includes(c.id));
        if (!availableCard) return;

        if (selectedIds.length >= SACRIFICE_COUNT) {
            showToast(`Max ${SACRIFICE_COUNT} cards allowed`, "info");
            return;
        }
        setSelectedIds(prev => [...prev, availableCard.id]);
    };

    const removeFromId = (id: string) => {
        setSelectedIds(prev => prev.filter(i => i !== id));
    };

    const handleFuse = async () => {
        if (selectedIds.length < SACRIFICE_COUNT || !targetRarity) return;

        setIsFusing(true);
        try {
            const result = await generateNaturalCard(targetRarity);
            if (result) {
                setProposal(result);
                setRerollCount(0);
                playRevealSound(result.rarity);
            } else {
                showToast("The spirits of Wikipedia are silent. Try again.", "error");
            }
        } catch (error) {
            showToast("Fusion failed", "error");
        } finally {
            setIsFusing(false);
        }
    };

    const currentRerollCost = Math.floor(REROLL_BASE_COST * (1 + rerollCount * 0.5));

    const handleReroll = async () => {
        if (!targetRarity) return;
        
        if (deductCoins(currentRerollCost)) {
            setIsFusing(true);
            try {
                const result = await generateNaturalCard(targetRarity);
                if (result) {
                    setProposal(result);
                    setRerollCount(prev => prev + 1);
                    playRevealSound(result.rarity);
                    showToast("Rerolled!", "success");
                }
            } catch (error) {
                showToast("Reroll failed", "error");
            } finally {
                setIsFusing(false);
            }
        } else {
            showToast("Not enough WikiCoins to reroll!", "error");
        }
    };

    const handleClaim = () => {
        if (!proposal) return;

        // Remove sacrificed cards
        selectedIds.forEach(id => removeCard(id));
        
        // Save new card
        const newCard: WikiCard = {
            ...proposal,
            id: `${proposal.id}-${Date.now()}`,
            obtainedFrom: "Wiki-Fusion Ritual"
        };
        saveCollection([newCard]);
        
        logActivity('card_crafted', `Fused 5 cards for a ${newCard.rarity}: ${newCard.title}`, -rerollCount * currentRerollCost);
        
        playForgeSound();
        setSuccess(true);
        setProposal(null);
        setSelectedIds([]);
        setCollection(getCollection());
        showToast(`Successfully fused ${newCard.title}!`, "success");
        
        setTimeout(() => setSuccess(false), 5000);
    };

    const handleCancel = () => {
        setProposal(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {proposal ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 border border-indigo-500/20 rounded-3xl min-h-[500px] relative overflow-hidden backdrop-blur-md">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="flex flex-col items-center gap-8 z-10"
                    >
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                             Fusion Proposition
                        </h2>
                        
                        <Card card={proposal} />
                        
                        <div className="flex flex-col gap-3 w-full max-w-sm">
                            <button
                                onClick={handleClaim}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                CLAIM THIS CARD
                            </button>
                            
                            <button
                                onClick={handleReroll}
                                disabled={isFusing}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                {isFusing ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                        REROLL ({currentRerollCost} 🪙)
                                    </>
                                )}
                            </button>
                            
                            <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest">
                                Reroll cost increases each time
                            </p>
                            
                            <button
                                onClick={handleCancel}
                                className="mt-4 text-slate-500 hover:text-white text-sm font-bold transition-colors"
                            >
                                CANCEL FUSION
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
                    {/* Left: Altar */}
                    <div className="flex-1">
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm flex flex-col items-center sticky top-24 h-[650px] justify-between">
                            <div className="w-full flex-1 flex flex-col">
                                <h2 className="text-xl font-black text-slate-300 mb-4 uppercase tracking-[0.2em] flex items-center justify-center gap-3 italic text-center">
                                    <Sparkles className="w-5 h-5 text-indigo-400" />
                                    Ritual Altar
                                </h2>
                                
                                <div className="relative w-full max-w-sm mx-auto flex-1 flex flex-col items-center justify-center gap-4">
                                    {/* Geometric Ritual Layout (2-1-2) */}
                                    {/* Top Row */}
                                    <div className="flex justify-center gap-10 w-full">
                                        {[0, 1].map(i => renderSlot(i))}
                                    </div>
                                    
                                    {/* Center Row */}
                                    <div className="flex justify-center w-full z-10 -my-2">
                                        {renderSlot(2, 'scale-125 shadow-indigo-500/40')}
                                    </div>

                                    {/* Bottom Row */}
                                    <div className="flex justify-center gap-10 w-full">
                                        {[3, 4].map(i => renderSlot(i))}
                                    </div>
                                    
                                    {/* Connecting lines or glow placeholder */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
                                </div>
                            </div>
                            
                            <div className="w-full mt-4">
                                {selectedRarity ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-6 text-center"
                                    >
                                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-2 opacity-50 italic">Transmutation Target</p>
                                        <p className="text-3xl font-black text-white uppercase tracking-tighter">
                                            {(targetRarity || 'MAX').toUpperCase()} CARD
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="mb-6 h-[40px] flex items-center justify-center text-center px-4">
                                         <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-600">Select {SACRIFICE_COUNT} cards to begin</p>
                                    </div>
                                )}
                                
                                <button
                                    disabled={selectedIds.length < SACRIFICE_COUNT || isFusing}
                                    onClick={handleFuse}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 disabled:grayscale text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] transition-all active:scale-95 flex items-center justify-center gap-4 group text-base relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                    {isFusing ? (
                                        <RefreshCw className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Hammer className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                                            BEGIN RITUAL
                                        </>
                                    )}
                                </button>
                                
                                <div className="mt-4 text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${selectedIds.length === SACRIFICE_COUNT ? 'text-indigo-400 animate-pulse' : 'text-slate-600'}`}>
                                        {selectedIds.length === SACRIFICE_COUNT 
                                            ? "The spirits are ready" 
                                            : `${SACRIFICE_COUNT - selectedIds.length} cards remaining`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right: Picker */}
                    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-8 h-[650px] flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                             <h3 className="font-black text-white flex items-center gap-3 text-base uppercase tracking-tighter italic">
                                Offering Pool
                                <span className="not-italic text-[9px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-md tracking-widest">
                                    {groupedCards.length} UNIQUE TYPES
                                </span>
                            </h3>

                            {/* Sort Filters */}
                            {!selectedRarity && (
                                <div className="flex flex-wrap gap-1 justify-end">
                                    {['All', 'Common', 'Uncommon', 'Rare', 'Epic'].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRarityFilter(r as any)}
                                            className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase transition-all border ${rarityFilter === r ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800 border-white/5 text-slate-400 hover:text-white hover:border-white/10'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search Bar - Compact */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                        
                        {/* Grid - NOW SCROLLABLE */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 align-top">
                                {paginatedGroups.length > 0 ? (
                                    paginatedGroups.map(group => {
                                        const firstCard = group[0];
                                        const selectedCount = group.filter(c => selectedIds.includes(c.id)).length;
                                        const totalInGroup = group.length;

                                        return (
                                            <div key={firstCard.id} className="relative transition-transform duration-300 hover:scale-[1.02]">
                                                <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-2">
                                                    <button
                                                        onClick={() => addFromGroup(group)}
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xl ${selectedCount > 0 ? 'bg-indigo-600 border-2 border-white text-white rotate-0 scale-110' : 'bg-black/60 border border-white/20 text-white/50 hover:bg-white hover:text-black hover:border-white'}`}
                                                    >
                                                        {selectedCount > 0 ? (
                                                            <span className="text-[10px] font-black">{selectedCount}</span>
                                                        ) : (
                                                            <div className="w-3 h-3 rounded-full border-2 border-current" />
                                                        )}
                                                    </button>
                                                    
                                                    {totalInGroup > 1 && (
                                                        <span className="bg-slate-900/80 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-full text-[8px] font-black text-slate-400">
                                                            x{totalInGroup} OWNED
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={`transition-all flex items-center justify-center group ${selectedCount > 0 ? 'drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]' : ''}`}>
                                                    <div className="scale-[0.55] -my-20 transform-gpu transition-transform">
                                                        <Card card={firstCard} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full h-[300px] flex flex-col items-center justify-center opacity-30 text-center px-8 border-2 border-dashed border-white/5 rounded-3xl">
                                        <Hammer className="w-12 h-12 mb-4" />
                                        <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-sm">Nothing Found</h4>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl bg-slate-800 border border-white/5 text-slate-400 disabled:opacity-20 hover:text-white transition-all shadow-lg"
                            >
                                <RefreshCw className="w-4 h-4 rotate-180" />
                            </button>
                            
                            <div className="flex gap-1">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    // Simple pagination logic for demonstration
                                    let pageNum = i + 1;
                                    if (totalPages > 5 && currentPage > 3) {
                                        pageNum = currentPage - 3 + i + 1;
                                        if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                    }
                                    
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all border ${currentPage === pageNum ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-800 border-white/5 text-slate-500 hover:text-white'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="p-2 rounded-xl bg-slate-800 border border-white/5 text-slate-400 disabled:opacity-20 hover:text-white transition-all shadow-lg"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="mt-4 text-center">
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                Page {currentPage} of {totalPages || 1}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
