# WikiCards - Design Document
Date: 2026-03-08

## Overview
WikiCards is a collectible card game based on Wikipedia articles. 
Players open boosters to discover random articles transformed into trading cards.
The rarity of each card is dynamically calculated based on the real-time pageviews of the Wikipedia article.

## Core Mechanics
- **Collection Focus**: No combat. The main goal is completing the collection and opening packs.
- **Boosters**: 1 booster contains 5 random cards from Wikipedia.
- **Daily Rewards**: Players get 3 free boosters per day.
- **Rarity System**:
  - Common: > 50k views/month (Grey)
  - Uncommon: 10k-50k views/month (Green)
  - Rare: 1k-10k views/month (Blue)
  - Epic: < 1k views/month (Purple)
  - Legendary: Featured Article on Wikipedia (Gold Holographic)

## Technical Architecture
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS + Custom CSS for holographics/animations
- **Data Source**: Wikipedia API (Action API) for random articles, pageviews, categories, extracts, and images
- **Storage**: localStorage (persistent without requiring accounts)

## Visual Direction
- **Theme**: Dark & Premium
- **Card Aesthetics**: 3D tilt effects, holographic shimmer on Rare+ cards.
- **Booster Opening**: Animated reveal of 5 cards with specific effects tied to rarity.

## Planned Views
1. **Home**: Landing page, total collection stats, call to action.
2. **Booster Opening**: The interactive pack opening experience.
3. **Collection**: Grid of collected cards, filters, and missing card silhouettes.
4. **Card Detail**: Full screen view of a specific card with a link to the original Wikipedia article.
