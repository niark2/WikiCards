"use client";

import { Rarity } from "@/types";
import { Layers, Calendar, Download, Upload, Search } from "lucide-react";
import { SortOption } from "../_hooks/useCollectionState";

interface CollectionHeaderProps {
    groupedCardsCount: number;
    totalCardsCount: number;
    totalValue: number;
    filter: Rarity | "All";
    setFilter: (filter: Rarity | "All") => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
    cardSelectionMode: boolean;
    toggleSelectionMode: () => void;
    handleExport: () => void;
    handleImport: () => void;
    isExporting?: boolean;
    isImporting?: boolean;
}

const RARITIES: (Rarity | "All")[] = ["All", "Legendary", "Epic", "Rare", "Uncommon", "Common"];

export function CollectionHeader({
    groupedCardsCount,
    totalCardsCount,
    totalValue,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    cardSelectionMode,
    toggleSelectionMode,
    handleExport,
    handleImport,
    isExporting,
    isImporting,
}: CollectionHeaderProps) {
    return (
        <div className="mb-6 border-b border-white/5 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 flex items-center gap-3">
                        <Layers className="text-indigo-500 w-8 h-8" />
                        My Collection
                    </h1>
                    <div className="flex flex-col gap-1">
                        <p className="text-slate-400">
                            You have collected <span className="text-white font-bold">{groupedCardsCount}</span> unique articles (<span className="text-indigo-400 font-bold">{totalCardsCount}</span> total cards).
                        </p>
                        <p className="text-slate-400 flex items-center gap-2">
                            Total resale value:
                            <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-500/20">
                                <span className="w-3 h-3 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-amber-950">W</span>
                                {totalValue.toLocaleString()} WikiCoins
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleImport}
                        disabled={isImporting}
                        className="px-4 py-2 rounded-xl bg-slate-800 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-2 text-sm"
                        title="Import collection from JSON"
                    >
                        <Upload className="w-4 h-4" />
                        <span>{isImporting ? 'Importing...' : 'Import'}</span>
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-4 py-2 rounded-xl bg-slate-800 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-2 text-sm"
                        title="Export collection to JSON"
                    >
                        <Download className="w-4 h-4" />
                        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                    </button>
                </div>
            </div>

            <div className="mt-4 md:mt-6 flex flex-col gap-4">
                {/* Rarity Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 flex-nowrap">
                    {RARITIES.map(r => (
                        <button
                            key={r}
                            onClick={() => setFilter(r)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === r
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap">Sort By</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer pr-2"
                        >
                            <option value="recent">Recently Added</option>
                            <option value="rarity">Highest Rarity</option>
                            <option value="alphabetical">Alphabetical (A-Z)</option>
                        </select>
                    </div>

                    <button
                        onClick={toggleSelectionMode}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${cardSelectionMode
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        {cardSelectionMode ? 'Cancel Selection' : 'Multi-Select Mode'}
                    </button>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-auto mt-2 md:mt-0 md:ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search cards..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 bg-slate-800/50 border border-white/5 text-sm text-white placeholder:text-slate-500 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
