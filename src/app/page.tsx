import Link from "next/link";
import { Sparkles, Layers, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 flex flex-col items-center max-w-2xl -mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Discover the knowledge of humanity</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tight mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
          WikiCards
        </h1>

        <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
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
    </div>
  );
}
