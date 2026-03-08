"use client";

import Link from "next/link";
import { Layers, Coins, Home, Sparkles, Hammer, BookOpen, HelpCircle, ShoppingBag } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";

export function Navbar() {
    const { coins } = useCoins();

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
                        <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                        <span className="hidden md:inline">Boosters</span>
                    </Link>
                    <Link href="/market" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                        <ShoppingBag className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                        <span className="hidden md:inline">Market</span>
                    </Link>
                    <Link href="/craft" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                        <Hammer className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                        <span className="hidden md:inline">Forge</span>
                    </Link>
                    <Link href="/collection" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                        <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        <span className="hidden md:inline">Collection</span>
                    </Link>
                    <Link href="/faq" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                        <HelpCircle className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                        <span className="hidden md:inline">FAQ</span>
                    </Link>

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
