import Link from "next/link";
import { Sparkles, Layers, BookOpen, Search, Trophy, Gamepad2, Zap, Globe, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center px-4 py-6 md:p-8 text-center relative overflow-x-hidden pt-20 md:pt-32 pb-20">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="z-10 flex flex-col items-center max-w-2xl mb-16 md:mb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Discover the knowledge of humanity</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-serif tracking-tight mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
          WikiCards
        </h1>

        <p className="text-base sm:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
          Open boosters, collect random Wikipedia articles, and build your ultimate knowledge collection with true pageview-based rarity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/booster"
            className="group relative inline-flex items-center justify-center h-14 px-8 font-medium text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
            <Layers className="w-5 h-5 mr-2" />
            Open a Booster
          </Link>

          <Link
            href="/collection"
            className="inline-flex items-center justify-center h-14 px-8 font-medium transition-all border rounded-xl border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            View Collection
          </Link>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="z-10 w-full max-w-5xl mb-16 md:mb-32">
        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8 md:mb-12 text-slate-100">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">1. Acquire Boosters</h3>
            <p className="text-slate-400">Use your WikiCoins to purchase boosters or claim your daily free pack to start your journey.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">2. Discover Knowledge</h3>
            <p className="text-slate-400">Each card is a real article. Learn about history, science, or pop culture as you reveal your cards.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">3. Build Your Legacy</h3>
            <p className="text-slate-400">Organize your collection, track its total value, and strive to find the rarest Legendary articles.</p>
          </div>
        </div>
      </div>

      {/* Features Bento Grid */}
      <div className="z-10 w-full max-w-5xl mb-16 md:mb-32">
        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8 md:mb-12 text-slate-100">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 h-auto">
          {/* Feature 1: Wikipedia API */}
          <div className="md:col-span-3 md:row-span-1 p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex flex-col justify-end text-left relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-indigo-400/20 group-hover:text-indigo-400/40 transition-colors">
              <Globe className="w-32 h-32 -mr-8 -mt-8" />
            </div>
            <div className="relative z-10">
              <Globe className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-2xl font-bold text-slate-100 mb-2">Encyclopedic Library</h3>
              <p className="text-slate-400">Access millions of articles directly from Wikipedia, transformed into collectible cards.</p>
            </div>
          </div>

          {/* Feature 2: Pageview Rarity */}
          <div className="md:col-span-3 md:row-span-1 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-end text-left relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-blue-400/20 group-hover:text-blue-400/40 transition-colors">
              <Zap className="w-32 h-32 -mr-8 -mt-8" />
            </div>
            <div className="relative z-10">
              <Zap className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-slate-100 mb-2">Real-Time Rarity</h3>
              <p className="text-slate-400">Rarity isn't arbitrary. It's calculated using live monthly pageview data from the Wikipedia API.</p>
            </div>
          </div>

          {/* Feature 3: Games */}
          <div className="md:col-span-2 md:row-span-1 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-end text-left relative overflow-hidden group">
            <div className="relative z-10">
              <Gamepad2 className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-100 mb-2">Mini-Games</h3>
              <p className="text-slate-400">Spin the WikiWheel or use the Forge to earn extra WikiCoins and rare items.</p>
            </div>
          </div>

          {/* Feature 4: Security/Trust */}
          <div className="md:col-span-4 md:row-span-1 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center gap-8 text-left relative overflow-hidden group">
            <div className="flex-1 relative z-10">
              <Shield className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-2xl font-bold text-slate-100 mb-2">Daily Free Rewards</h3>
              <p className="text-slate-400">Log in every day to claim your free standard booster and keep your collection growing without spending a coin.</p>
            </div>
            <div className="flex-shrink-0 w-32 h-32 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
              <Sparkles className="w-16 h-16 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="z-10 w-full max-w-2xl py-12 md:py-20 px-4 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-slate-900/20 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-white text-center">Ready to explore?</h2>
          <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto">
            Your first booster is waiting. Start building your knowledge collection today.
          </p>
          <Link
            href="/booster"
            className="inline-flex items-center justify-center h-16 px-12 text-lg font-bold text-white transition-all bg-indigo-600 rounded-2xl hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            Start Collecting
          </Link>
        </div>
      </div>
    </div>
  );
}
