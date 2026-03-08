"use client";

import { motion } from "framer-motion";
import {
    HelpCircle,
    Zap,
    Coins,
    Hammer,
    ShieldCheck,
    Layers,
    TrendingUp,
    ChevronDown
} from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "What is WikiCards?",
        answer: "WikiCards is a collection game where you turn the universal knowledge of Wikipedia into trading cards. Each Wikipedia article becomes a unique card with its own stats and rarity based on its real-world popularity.",
        icon: <Layers className="w-5 h-5 text-indigo-400" />
    },
    {
        question: "How is rarity determined?",
        answer: "Rarity doesn't come from luck, but from the article's importance on Wikipedia! We use global view statistics from the last 30 days: \n\n• Legendary: +100,000 views/month\n• Epic: +20,000 views/month\n• Rare: +5,000 views/month\n• Uncommon: +500 views/month\n• Common: Less than 500 views/month",
        icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
    },
    {
        question: "How to get WikiCoins?",
        answer: "You start with 50 WikiCoins. To earn more, you can sell cards you no longer want in your Collection. The rarer the card, the higher the resale value! You can also find coin pouches directly in boosters.",
        icon: <Coins className="w-5 h-5 text-amber-500" />
    },
    {
        question: "What is the Forge for?",
        answer: "The Forge allows you to bypass booster randomness. If you want a specific card (e.g., your favorite singer or city), you can enter its Wikipedia URL. The crafting cost will be high and depends on the article's rarity.",
        icon: <Hammer className="w-5 h-5 text-orange-400" />
    },
    {
        question: "Why doesn't my card have an image?",
        answer: "Not all Wikipedia pages have a 'valid' main illustration image for the API. In that case, we display a stylized 'W' to preserve the card's aesthetics. For the Forge, we've optimized the search to retrieve even logos and complex illustrations.",
        icon: <ShieldCheck className="w-5 h-5 text-blue-400" />
    },
    {
        question: "Is my data saved?",
        answer: "Currently, all your progress (collection, coins, folders) is stored locally in your browser. If you clear your cache or change browsers, you will lose your progress.",
        icon: <Zap className="w-5 h-5 text-yellow-400" />
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden pt-24 pb-20">
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
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-slate-400 text-lg">Everything you need to know about the WikiCards universe.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all flex items-start gap-4 ${openIndex === index
                                    ? "bg-slate-900 border-indigo-500/30 shadow-lg shadow-indigo-500/5"
                                    : "bg-slate-900/50 border-white/5 hover:border-white/10"
                                    }`}
                            >
                                <div className={`mt-1 shrink-0 transition-transform duration-300 ${openIndex === index ? "scale-110" : ""}`}>
                                    {faq.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className={`font-bold transition-colors ${openIndex === index ? "text-white" : "text-slate-200"}`}>
                                            {faq.question}
                                        </h3>
                                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-indigo-400" : ""}`} />
                                    </div>

                                    <div className={`grid transition-all duration-300 ${openIndex === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                                        <div className="overflow-hidden">
                                            <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-transparent border border-indigo-500/20 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
                    <p className="text-slate-400 mb-6">Explore Wikipedia to discover the hidden secrets behind every card.</p>
                    <div className="flex justify-center gap-4">
                        <a href="/" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10">Back to Home</a>
                        <a href="/booster" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all">Open a Booster</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
