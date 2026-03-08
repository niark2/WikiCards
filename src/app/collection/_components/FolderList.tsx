"use client";

import { Playlist } from "@/types";
import { Layers, PlusCircle, Folder, FolderOpen, ChevronLeft } from "lucide-react";

interface FolderListProps {
    playlists: Playlist[];
    activePlaylist: string | "None";
    setActivePlaylist: (id: string | "None") => void;
    handleCreatePlaylist: () => void;
    totalCardsCount: number;
    groupedCardsCount: number;
    filteredCardsCount: number;
}

export function FolderList({
    playlists,
    activePlaylist,
    setActivePlaylist,
    handleCreatePlaylist,
    totalCardsCount,
    groupedCardsCount,
    filteredCardsCount,
}: FolderListProps) {
    return (
        <>
            {/* Back button when inside a folder */}
            {activePlaylist !== "None" && (
                <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 border-t border-white/5 pt-6 mb-6">
                    <button
                        onClick={() => setActivePlaylist("None")}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1 shadow-inner"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Folders
                    </button>
                    <span className="text-amber-500 font-bold ml-2 flex items-center gap-2">
                        <FolderOpen className="w-5 h-5" />
                        {playlists.find(p => p.id === activePlaylist)?.name}
                        <span className="text-slate-500 text-xs tracking-wider">({groupedCardsCount} unique, {filteredCardsCount} total)</span>
                    </span>
                </div>
            )}

            {/* Folders grid (only when not inside a folder) */}
            {activePlaylist === "None" && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-serif text-slate-200 flex items-center gap-2">
                            <Folder className="w-5 h-5 text-amber-500" /> My Cardlists
                        </h2>
                        <button
                            onClick={handleCreatePlaylist}
                            className="px-4 py-2 rounded-full text-sm font-medium border border-dashed border-amber-600/50 text-amber-500 hover:bg-amber-600/10 transition-colors flex items-center gap-1"
                        >
                            <PlusCircle className="w-4 h-4" /> New Folder
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                        <div
                            onClick={() => setActivePlaylist("None")}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border group ${activePlaylist === "None"
                                ? "bg-indigo-600/20 border-indigo-500/50"
                                : "bg-slate-800/50 border-white/5 hover:bg-slate-700/50"
                                }`}
                        >
                            <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                                <Layers className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-white text-[11px] leading-tight truncate">All Cards</p>
                                <p className="text-[10px] text-slate-500">{totalCardsCount} items</p>
                            </div>
                        </div>

                        {playlists.map(p => (
                            <div
                                key={p.id}
                                onClick={() => setActivePlaylist(p.id)}
                                className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 rounded-xl cursor-pointer transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                    <Folder className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-white text-[11px] leading-tight truncate">{p.name}</p>
                                    <p className="text-[10px] text-amber-500/50">{p.cardIds.length} cards</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
