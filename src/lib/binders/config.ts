import { Binder } from "./types";

export const BINDERS: Binder[] = [
    {
        id: 'space-explorer',
        title: 'Space Explorer',
        description: 'Collect cards related to astronomy and deep space.',
        icon: 'Rocket',
        targetCount: 10,
        reward: 600,
        type: 'thematic',
        criteria: {
            categoryKeywords: ['space', 'astronomy', 'planet', 'nasa', 'galaxy', 'rocket', 'moon', 'mars', 'astrophysics', 'star ', 'nebula']
        }
    },
    {
        id: 'common-collector',
        title: 'Bronze Collector',
        description: 'Own 30 different Common rarity cards.',
        icon: 'Layers',
        targetCount: 30,
        reward: 250,
        type: 'rarity',
        criteria: {
            rarity: 'Common'
        }
    },
    {
        id: 'epic-circle',
        title: 'The Private Circle',
        description: 'Own 15 different Epic cards.',
        icon: 'Crown',
        targetCount: 15,
        reward: 800,
        type: 'rarity',
        criteria: {
            rarity: 'Epic'
        }
    },
    {
        id: 'legendary-hunter',
        title: 'Myth Hunter',
        description: 'Own 5 different Legendary cards.',
        icon: 'Sparkles',
        targetCount: 5,
        reward: 1000,
        type: 'rarity',
        criteria: {
            rarity: 'Legendary'
        }
    },
    {
        id: 'global-archivist',
        title: 'Grand Archivist',
        description: 'Own 100 different unique cards in total.',
        icon: 'Library',
        targetCount: 100,
        reward: 750,
        type: 'volume',
        criteria: {}
    }
];
