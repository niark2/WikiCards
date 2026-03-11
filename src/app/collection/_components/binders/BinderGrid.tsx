"use client";

import { Binder, BinderProgress } from "@/lib/binders/types";
import { BinderCard } from "./BinderCard";
import { useState } from "react";
import { BinderDetailsModal } from "./BinderDetailsModal";
import { WikiCard } from "@/types";

interface BinderGridProps {
    binders: Binder[];
    progressions: BinderProgress[];
    claimedBinderIds: string[];
    collection: WikiCard[];
    onClaimReward: (binderId: string, amount: number) => void;
}

export function BinderGrid({ binders, progressions, claimedBinderIds, collection, onClaimReward }: BinderGridProps) {
    const [selectedBinder, setSelectedBinder] = useState<Binder | null>(null);

    const handleViewDetails = (binder: Binder) => {
        setSelectedBinder(binder);
    };

    const handleClaim = (binder: Binder) => {
        onClaimReward(binder.id, binder.reward);
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
                    <div key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mb-6 flex flex-col gap-1">
                            <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                {category.label}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium ml-4.5">{category.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {categoryBinders.map(binder => {
                                const progress = progressions.find(p => p.binderId === binder.id) || {
                                    binderId: binder.id,
                                    currentCount: 0,
                                    isCompleted: false,
                                    foundCardIds: []
                                };
                                const isClaimed = claimedBinderIds.includes(binder.id);

                                return (
                                    <BinderCard
                                        key={binder.id}
                                        binder={binder}
                                        progress={progress}
                                        isClaimed={isClaimed}
                                        onViewDetails={handleViewDetails}
                                        onClaimReward={handleClaim}
                                    />
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
