import { WikiCard } from "@/types";
import { Binder, BinderProgress } from "./types";

export function isCardInBinder(card: WikiCard, binder: Binder): boolean {
    if (binder.type === 'rarity') {
        return card.rarity === binder.criteria.rarity;
    }

    if (binder.type === 'thematic') {
        if (!card.wikiCategories || card.wikiCategories.length === 0) return false;
        
        return card.wikiCategories.some(cat => 
            binder.criteria.categoryKeywords?.some(key => 
                cat.toLowerCase().includes(key.toLowerCase())
            )
        );
    }

    if (binder.type === 'volume') {
        return true;
    }

    return false;
}

export function calculateBinderProgress(binder: Binder, collection: WikiCard[]): BinderProgress {
    // We only count unique articles (by url or title)
    const uniqueCardsMap = new Map<string, WikiCard>();
    collection.forEach(card => {
        const key = card.url || card.title;
        if (!uniqueCardsMap.has(key)) {
            uniqueCardsMap.set(key, card);
        }
    });

    const uniqueCards = Array.from(uniqueCardsMap.values());
    const matchedCards = uniqueCards.filter(card => isCardInBinder(card, binder));
    
    // We limit foundCardIds to targetCount to avoid overflow in UI silhouettes if more are found
    // or we can show all of them. Let's keep them all for now.
    const foundCardIds = matchedCards.map(c => c.id);

    return {
        binderId: binder.id,
        currentCount: matchedCards.length,
        isCompleted: matchedCards.length >= binder.targetCount,
        foundCardIds
    };
}
