# Binder System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a decorative "Binder" (Classeur) system where players can complete thematic or rarity-based card sets for WikiCoin rewards.

**Architecture:**
1. Extend `WikiCard` with `wikiCategories`.
2. Update Wiki API to fetch these categories.
3. Create a library of Binders with matching logic.
4. Add a "Binders" tab to the Collection page with a dedicated UI.

**Tech Stack:** Next.js (App Router), React, Lucide React, Framer Motion, LocalStorage.

---

### Task 1: Type Extensions

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/lib/wiki/types.ts`

**Step 1: Update WikiCard and API types**
Add `wikiCategories?: string[]` to `WikiCard` in `src/types/index.ts`.
Add `categories?: { title: string }[]` to `WikiPageDetails` in `src/lib/wiki/types.ts`.

**Step 2: Commit**
```bash
git add src/types/index.ts src/lib/wiki/types.ts
git commit -m "types: add wikiCategories to WikiCard and PageDetails"
```

---

### Task 2: Wiki API Category Fetching

**Files:**
- Modify: `src/lib/wiki/api.ts`

**Step 1: Update fetchArticleDetails and fetchWikiArticle**
Include `categories` property in the Wikipedia API calls. Use `cllimit=50`.
Filter raw category titles to remove Wikipedia internal prefixes like "Category:All articles...", "Category:Articles with...", etc.

**Step 2: Commit**
```bash
git add src/lib/wiki/api.ts
git commit -m "feat: fetch and store wikipedia categories for cards"
```

---

### Task 3: Binder Configuration and Logic

**Files:**
- Create: `src/lib/binders/types.ts`
- Create: `src/lib/binders/config.ts`
- Create: `src/lib/binders/logic.ts`

**Step 1: Define Binder types and config**
Define binders: `space-explorer`, `common-collector`, `legendary-hunter`, `global-archivist`, `epic-circle`.

**Step 2: Create matching logic**
Implement `getBinderProgress(binder, collection)` and `isCardInBinder(card, binder)`.

**Step 3: Commit**
```bash
git add src/lib/binders/
git commit -m "feat: define binder configurations and matching logic"
```

---

### Task 4: Storage for Rewards

**Files:**
- Modify: `src/lib/storage.ts`

**Step 1: Add claimBinderReward function**
Track claimed binder IDs in `wikicards_binders_claimed`.
Implement `getClaimedBinders()` and `claimReward(binderId, amount)`.

**Step 2: Commit**
```bash
git add src/lib/storage.ts
git commit -m "feat: add storage logic for claiming binder rewards"
```

---

### Task 5: Binder UI Components

**Files:**
- Create: `src/app/collection/_components/binders/BinderGrid.tsx`
- Create: `src/app/collection/_components/binders/BinderCard.tsx`
- Create: `src/app/collection/_components/binders/BinderDetailsModal.tsx`

**Step 1: Implement BinderCard**
Show title, icon, progress bar, and "Claim" button.

**Step 2: Implement BinderDetailsModal**
Show the grid of silhouettes (found cards vs. missing slots).

**Step 3: Commit**
```bash
git add src/app/collection/_components/binders/
git commit -m "ui: implement binder grid and cards components"
```

---

### Task 6: Collection Page Integration

**Files:**
- Modify: `src/app/collection/_hooks/useCollectionState.ts`
- Modify: `src/app/collection/page.tsx`
- Modify: `src/app/collection/_components/CollectionHeader.tsx` (optional, for tab switching)

**Step 1: Add tab state to useCollectionState**
Add `activeTab: 'inventory' | 'binders'` to state.

**Step 2: Update Collection page layout**
Wrap the current content in conditional rendering based on `activeTab`.
Add the tab switcher in the header or sub-header.

**Step 3: Commit**
```bash
git add src/app/collection/
git commit -m "feat: integrate binders tab into collection page"
```

---

### Task 7: Verification

**Step 1: Manual Test**
1. Check that new cards open with categories.
2. Check that the "Space Explorer" binder progress increases when getting a space-related card.
3. Verify reward claiming works and coins are added.

**Step 2: Final Commit**
```bash
git commit -m "finish: binder system implementation complete"
```
