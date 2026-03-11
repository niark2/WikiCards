# Design Plan: Binder System (Classeurs)

## Overview
The Binder system adds a progression layer to the WikiCards collection. Players can complete thematic or rarity-based "albums" to earn WikiCoins.

## 1. Data Structure Changes

### WikiCard Extension
Update the `WikiCard` interface to store the Wikipedia category data.
```typescript
interface WikiCard {
  // Existing fields...
  wikiCategories?: string[]; // Raw categories from Wikipedia
}
```

### Binder Configuration (`src/lib/binders/config.ts`)
A central registry for all available binders.
```typescript
export interface Binder {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or URL
  targetCount: number;
  reward: number;
  // Logic for completion
  type: 'thematic' | 'rarity' | 'volume';
  criteria: {
    rarity?: Rarity;
    categoryKeywords?: string[]; // Match if any wikiCategory contains one of these
  };
}
```

## 2. Thematic Logic (Wikipedia Integration)

### Category Fetching
Update `fetchWikiArticle` in `src/lib/wiki/api.ts` to include categories in the query:
- Add `prop=categories`
- Add `cllimit=50`
- Filter out internal Wikipedia categories (e.g., those starting with "All articles", "CS1", "Webarchive").

### Matching Engine
A utility function will check if a card belongs to a binder:
```typescript
function isCardInBinder(card: WikiCard, binder: Binder): boolean {
  if (binder.type === 'rarity') return card.rarity === binder.criteria.rarity;
  if (binder.type === 'thematic') {
    return card.wikiCategories?.some(cat => 
      binder.criteria.categoryKeywords?.some(key => 
        cat.toLowerCase().includes(key.toLowerCase())
      )
    ) ?? false;
  }
  return true; // volume
}
```

## 3. Initial Binders List

| ID | Title | Criteria | Reward |
|:---|:---|:---|:---|
| `space-explorer` | **Pionnier de l'Espace** | Categories: space, astronomy, planet, nasa, galaxy, rocket, moon, mars | **600 WC** |
| `common-collector` | **Collectionneur de Bronze** | Rarity: Common (30 unique) | **250 WC** |
| `legendary-hunter` | **Chasseur de Mythes** | Rarity: Legendary (5 unique) | **1000 WC** |
| `global-archivist` | **Le Grand Archiviste** | Volume: 100 unique cards | **750 WC** |
| `epic-circle` | **Le Cercle Privé** | Rarity: Epic (15 unique) | **800 WC** |

## 4. User Interface

### Collection Page Tabs
- **Inventory**: Current grid view.
- **Binders**: New grid of "Album Covers".

### Binder Detail View
- **Silhouettes**: A grid showing the required slots.
  - Filled slots show the card image.
  - Empty slots show a generic silhouette with a "?" icon.
- **Progress Bar**: A visual indicator of completion (e.g., 4/10).
- **Claim Button**: A large, animated button that activates when the target is reached.

## 5. Storage and Persistence
- `wikicards_binders_claimed`: A list of binder IDs already rewarded to prevent double-claiming.
- Progression is calculated on-the-fly from the current `wikicards_collection` to ensure it's always up-to-date.

---
**Status**: Design Validated by User. Ready for Implementation planning.
