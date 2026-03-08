"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Coins, Home, GalleryVertical, Hammer, BookOpen, ShoppingBag, Dices, ChevronDown, Compass } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";

export function Navbar() {
    const { coins } = useCoins();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-[100] bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-600/20 transition-all duration-300">
                        <Layers className="text-indigo-500 group-hover:scale-110 transition-transform w-6 h-6" />
                    </div>
                    <span className="font-serif font-bold text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                        WikiCards
                    </span>
                </Link>

                <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                        <Home className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        <span className="hidden md:inline">Home</span>
                    </Link>
                    <Link href="/booster" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                        <GalleryVertical className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                        <span className="hidden md:inline">Boosters</span>
                    </Link>

                    <Link href="/collection" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                        <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        <span className="hidden md:inline">Collection</span>
                    </Link>

                    {/* Dropdown Menu */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                            <Compass className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            <span className="hidden md:inline">ACTIVITIES</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                                >
                                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 w-48 shadow-2xl">
                                        <Link href="/market" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                                            <ShoppingBag className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                                            <span>Market</span>
                                        </Link>
                                        <Link href="/craft" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                                            <Hammer className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                            <span>Forge</span>
                                        </Link>
                                        <Link href="/gambling" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                                            <Dices className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                                            <span>Wheel</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4 ml-2">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black shadow-[inset_0_0_10px_rgba(245,158,11,0.05)]">
                            <Coins className="w-4 h-4 animate-pulse-slow" />
                            {coins}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
