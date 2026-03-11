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
        id: 'wildlife-observer',
        title: 'Wildlife Observer',
        description: 'Discover the wonders of animals, plants, and nature.',
        icon: 'Bird',
        targetCount: 15,
        reward: 700,
        type: 'thematic',
        criteria: {
            categoryKeywords: ['animal', 'mammal', 'bird', 'biology', 'wildlife', 'fauna', 'flora', 'forest', 'ocean', 'plant', 'insect', 'fish', 'reptile', 'botany', 'zoology']
        }
    },
    {
        id: 'time-traveler',
        title: 'Time Traveler',
        description: 'Uncover the secrets of ancient civilizations and history.',
        icon: 'History',
        targetCount: 15,
        reward: 750,
        type: 'thematic',
        criteria: {
            categoryKeywords: ['ancient', 'empire', 'civilization', 'archaeology', 'dynasty', 'renaissance', 'medieval', 'antiquity', 'prehistoric', 'historical period', 'bc', 'century']
        }
    },
    {
        id: 'silicon-pioneer',
        title: 'Silicon Pioneer',
        description: 'Master the world of technology, computers, and digital innovation.',
        icon: 'Cpu',
        targetCount: 12,
        reward: 650,
        type: 'thematic',
        criteria: {
            categoryKeywords: ['computer', 'hardware', 'software', 'internet', 'digital', 'electronics', 'robot', 'artificial intelligence', 'programming', 'computing', 'network', 'microprocessor']
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
        id: 'uncommon-unity',
        title: 'Silver Specialist',
        description: 'Own 25 different Uncommon rarity cards.',
        icon: 'Shield',
        targetCount: 25,
        reward: 400,
        type: 'rarity',
        criteria: {
            rarity: 'Uncommon'
        }
    },
    {
        id: 'rare-resonance',
        title: 'Golden Gatherer',
        description: 'Own 20 different Rare rarity cards.',
        icon: 'Gem',
        targetCount: 20,
        reward: 600,
        type: 'rarity',
        criteria: {
            rarity: 'Rare'
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
    },
    {
        id: 'master-curator',
        title: 'Master Curator',
        description: 'Own 250 different unique cards in total.',
        icon: 'BookOpen',
        targetCount: 250,
        reward: 1500,
        type: 'volume',
        criteria: {}
    },
    {
        id: 'world-chronicler',
        title: 'World Chronicler',
        description: 'Own 600 different unique cards in total.',
        icon: 'Globe',
        targetCount: 600,
        reward: 3500,
        type: 'volume',
        criteria: {}
    },
    {
        id: 'ultimate-polymath',
        title: 'Ultimate Polymath',
        description: 'Own 1000 different unique cards in total.',
        icon: 'Zap',
        targetCount: 1000,
        reward: 7500,
        type: 'volume',
        criteria: {}
    }
];
