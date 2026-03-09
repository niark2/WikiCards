"use client";

import { Playlist } from "@/types";
import { Layers, Trash2, Folder } from "lucide-react";

interface SelectionBarProps {
    selectedCount: number;
    playlists: Playlist[];
    handleBatchDiscard: () => void;
    handleBatchAddToPlaylist: (playlistId: string) => void;
}

export function SelectionBar({
    selectedCount,
    playlists,
    handleBatchDiscard,
    handleBatchAddToPlaylist,
}: SelectionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-3 flex flex-wrap items-center gap-3 md:gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl max-w-[calc(100%-2rem)]">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-black text-white">{selectedCount} <span className="text-slate-500 font-medium">Selected</span></span>
                </div>

                <div className="hidden md:block h-6 w-px bg-white/10" />

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleBatchDiscard}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Discard Cards
                    </button>

                    <div className="relative group/batch">
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                            <Folder className="w-3.5 h-3.5" /> Move to Folder
                        </button>
                        <div className="absolute bottom-full mb-4 right-0 w-56 bg-slate-900 border border-white/5 rounded-2xl shadow-2xl p-2 hidden group-hover/batch:flex flex-col gap-1 z-50 overflow-hidden">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest p-2 border-b border-white/5 mb-1">Select Destination</div>
                            {playlists.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleBatchAddToPlaylist(p.id)}
                                    className="text-left px-3 py-2.5 text-xs text-slate-200 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-xl transition-all truncate"
                                >
                                    {p.name}
                                </button>
                            ))}
                            {playlists.length === 0 && <p className="text-[10px] text-slate-500 p-4 italic text-center">No folders created yet</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
