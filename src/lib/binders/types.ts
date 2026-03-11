import { Rarity } from "@/types";

export type BinderType = 'thematic' | 'rarity' | 'volume';

export interface Binder {
    id: string;
    title: string;
    description: string;
    icon: string; // Lucide icon name
    targetCount: number;
    reward: number;
    type: BinderType;
    criteria: {
        rarity?: Rarity;
        categoryKeywords?: string[]; // Match if any wikiCategory contains one of these
    };
}

export interface BinderProgress {
    binderId: string;
    currentCount: number;
    isCompleted: boolean;
    foundCardIds: string[]; // Unique wikiIds found for this binder
}
