"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    HelpCircle,
    Zap,
    Coins,
    Layers,
    TrendingUp,
    ChevronDown
} from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "General: What is WikiCards & My Data",
        answer: "WikiCards turns Wikipedia articles into unique trading cards with real-world stats. Each article becomes a unique card based on its real-world popularity.\n\nCurrently, all your progress (collection, coins, folders) is stored locally in your browser. If you clear your cache or change browsers, you will lose your progress.",
        icon: <Layers className="w-5 h-5 text-indigo-400" />
    },
    {
        question: "Cards: Rarity & Visuals",
        answer: "Rarity is 100% authentic and based on global view statistics from the last 30 days:\n• Legendary: +100,000 views/month\n• Epic: +20,000 views/month\n• Rare: +5,000 views/month\n• Uncommon: +500 views/month\n• Common: Less than 500 views/month\n\nIf a card lacks an image, we display a stylized 'W' to preserve aesthetics. For the Forge, we've optimized the search to retrieve even logos and complex illustrations.",
        icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
    },
    {
        question: "Economy: WikiCoins & Resale",
        answer: "You start with 50 WikiCoins. To earn more, you can sell cards. The resale value depends on:\n• Base Rarity: From 5 (Common) to 1500 (Legendary).\n• Popularity Multiplier: Up to 2.5x for famous cards.\n• Bonuses: +25% for images, +10% for long content.\n\nPrices are capped between 5 and 5000 WikiCoins per card.",
        icon: <Coins className="w-5 h-5 text-amber-500" />
    },
    {
        question: "Store: Boosters & The Forge",
        answer: "Every pack contains 5 cards with guaranteed rarities:\n• Standard: 1 Uncommon+ (20 coins or 5 free daily)\n• Iron: 1 Rare+ (80 coins)\n• Gold: 1 Epic+ (200 coins)\n• Uranium: 2 Epics+, 40% Legendary chance (450 coins)\n\nThe Forge allows you to bypass randomness: enter any Wikipedia URL to craft a specific card. Cost depends on the article's rarity.",
        icon: <Zap className="w-5 h-5 text-yellow-400" />
    }
];

interface FAQItemProps {
    faq: {
        question: string;
        answer: string;
        icon: React.ReactNode;
    };
    index: number;
}

function FAQItem({ faq, index }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(index === 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left p-5 md:p-6 rounded-2xl border transition-all flex h-fit ${isOpen
                    ? "bg-slate-900 border-indigo-500/30 shadow-lg shadow-indigo-500/5"
                    : "bg-slate-900/50 border-white/5 hover:border-white/10"
                    }`}
            >
                <div className="flex gap-4 w-full h-full">
                    <div className={`mt-1 shrink-0 transition-transform duration-300 ${isOpen ? "scale-110" : ""}`}>
                        {faq.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className={`font-bold transition-colors text-sm md:text-base ${isOpen ? "text-white" : "text-slate-200"}`}>
                                {faq.question}
                            </h3>
                            <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-400" : ""}`} />
                        </div>

                        <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                            <div className="overflow-hidden">
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-line">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        </motion.div>
    );
}

export default function FAQPage() {
    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden pt-20 md:pt-24 pb-20">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-6"
                    >
                        <HelpCircle className="w-8 h-8 text-indigo-400" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-slate-400 text-lg">Everything you need to know about the WikiCards universe.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} index={index} />
                    ))}
                </div>

                <div className="mt-12 md:mt-20 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-transparent border border-indigo-500/20 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
                    <p className="text-slate-400 mb-6">Explore Wikipedia to discover the hidden secrets behind every card.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        <Link href="/" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10">Back to Home</Link>
                        <Link href="/booster" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all">Open a Booster</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
