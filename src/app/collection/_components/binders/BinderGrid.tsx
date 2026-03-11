"use client";

import { Binder, BinderProgress } from "@/lib/binders/types";
import { BinderCard } from "./BinderCard";
import { useState, useRef } from "react";
import { BinderDetailsModal } from "./BinderDetailsModal";
import { WikiCard } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BinderGridProps {
    binders: Binder[];
    progressions: BinderProgress[];
    claimedBinderIds: string[];
    collection: WikiCard[];
    onClaimReward: (binderId: string, amount: number) => void;
}

export function BinderGrid({ binders, progressions, claimedBinderIds, collection, onClaimReward }: BinderGridProps) {
    const [selectedBinder, setSelectedBinder] = useState<Binder | null>(null);
    const scrollContainers = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const handleViewDetails = (binder: Binder) => {
        setSelectedBinder(binder);
    };

    const handleClaim = (binder: Binder) => {
        onClaimReward(binder.id, binder.reward);
    };

    const scroll = (categoryId: string, direction: 'left' | 'right') => {
        const container = scrollContainers.current[categoryId];
        if (container) {
            const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const categories = [
        { id: 'thematic', label: 'Discovery Albums', description: 'Explore specific themes and topics.' },
        { id: 'rarity', label: 'Prestige Collections', description: 'Master each rarity level.' },
        { id: 'volume', label: 'Global Milestones', description: 'Your overall progression as an archivist.' },
    ];

    return (
        <div className="space-y-16">
            {categories.map(category => {
                const categoryBinders = binders.filter(b => b.type === category.id);
                if (categoryBinders.length === 0) return null;

                return (
                    <div key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
                        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-1">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                    {category.label}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium ml-4.5">{category.description}</p>
                            </div>

                            {categoryBinders.length > 4 && (
                                <div className="hidden md:flex gap-2">
                                    <button
                                        onClick={() => scroll(category.id, 'left')}
                                        className="p-2 rounded-full bg-slate-800 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => scroll(category.id, 'right')}
                                        className="p-2 rounded-full bg-slate-800 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div 
                            ref={el => { scrollContainers.current[category.id] = el; }}
                            className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory no-scrollbar"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {categoryBinders.map(binder => {
                                const progress = progressions.find(p => p.binderId === binder.id) || {
                                    binderId: binder.id,
                                    currentCount: 0,
                                    isCompleted: false,
                                    foundCardIds: []
                                };
                                const isClaimed = claimedBinderIds.includes(binder.id);

                                return (
                                    <div key={binder.id} className="flex-none w-[280px] md:w-[calc(25%-18px)] snap-start h-full">
                                        <BinderCard
                                            binder={binder}
                                            progress={progress}
                                            isClaimed={isClaimed}
                                            onViewDetails={handleViewDetails}
                                            onClaimReward={handleClaim}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {selectedBinder && (
                <BinderDetailsModal
                    binder={selectedBinder}
                    progress={progressions.find(p => p.binderId === selectedBinder.id)!}
                    collection={collection}
                    onClose={() => setSelectedBinder(null)}
                />
            )}
        </div>
    );
}
