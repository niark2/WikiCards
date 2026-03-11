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

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {binders.map(binder => {
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
