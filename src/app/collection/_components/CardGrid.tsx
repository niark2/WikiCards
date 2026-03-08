"use client";

import { WikiCard, Playlist } from "@/types";
import { Card } from "@/components/Card";
import { Trash2, PlusCircle } from "lucide-react";
import { RARITY_SELL_VALUES } from "@/lib/rarity";
import { CardGroup } from "../_hooks/useCollectionState";

interface CardGridProps {
    visibleCards: CardGroup[];
    filteredCardsCount: number;
    cardSelectionMode: boolean;
    selectedCardIds: string[];
    addingToPlaylistCard: string | null;
    activePlaylist: string | "None";
    playlists: Playlist[];
    toggleCardSelection: (ids: string[]) => void;
    handleDiscard: (card: WikiCard) => void;
    handleRemoveFromPlaylist: (playlistId: string, cardId: string) => void;
    handleAddToPlaylist: (playlistId: string, cardId: string) => void;
    setAddingToPlaylistCard: (cardId: string | null) => void;
}

export function CardGrid({
    visibleCards,
    filteredCardsCount,
    cardSelectionMode,
    selectedCardIds,
    addingToPlaylistCard,
    activePlaylist,
    playlists,
    toggleCardSelection,
    handleDiscard,
    handleRemoveFromPlaylist,
    handleAddToPlaylist,
    setAddingToPlaylistCard,
}: CardGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleCards.map(({ card, ids }, idx) => (
                <div
                    key={`${card.id}-${idx}`}
                    onClick={() => cardSelectionMode && toggleCardSelection(ids)}
                    className={`flex flex-col items-center gap-4 group perspective-1000 relative transition-all ${cardSelectionMode ? 'cursor-pointer active:scale-95' : ''}`}
                >
                    <div className={`relative transition-all duration-300 ${cardSelectionMode && ids.every(id => selectedCardIds.includes(id)) ? 'scale-105 shadow-[0_0_30px_rgba(99,102,241,0.4)] rounded-2xl' : ''}`}>
                        <Card card={card} count={ids.length} />
                        {cardSelectionMode && (
                            <div className={`absolute top-4 left-4 w-7 h-7 rounded-full border-2 z-30 flex items-center justify-center transition-all ${ids.every(id => selectedCardIds.includes(id)) ? 'bg-indigo-500 border-indigo-400' : 'bg-black/50 border-white/30 backdrop-blur-sm'}`}>
                                {ids.every(id => selectedCardIds.includes(id)) && <PlusCircle className="w-5 h-5 text-white rotate-45" />}
                            </div>
                        )}
                    </div>

                    {/* Hover Actions */}
                    {!cardSelectionMode && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap justify-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDiscard(card); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full text-[10px] font-bold uppercase transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                                +{RARITY_SELL_VALUES[card.rarity]}
                            </button>

                            {activePlaylist !== "None" ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveFromPlaylist(activePlaylist, card.id); }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-full text-[10px] font-bold uppercase transition-colors"
                                >
                                    Remove from Folder
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setAddingToPlaylistCard(addingToPlaylistCard === card.id ? null : card.id); }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-bold uppercase transition-colors"
                                >
                                    <PlusCircle className="w-3 h-3" />
                                    Add to Folder
                                </button>
                            )}
                        </div>
                    )}

                    {/* Cardlist Selection Dropdown */}
                    {!cardSelectionMode && addingToPlaylistCard === card.id && (
                        <div className="absolute top-[80%] z-20 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 flex flex-col gap-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 px-2">Select Folder:</p>
                            {playlists.length === 0 && (
                                <p className="text-xs text-slate-500 px-2 pb-1">No folders yet.</p>
                            )}
                            {playlists.map(p => (
                                <button
                                    key={p.id}
                                    onClick={(e) => { e.stopPropagation(); handleAddToPlaylist(p.id, card.id); }}
                                    className="text-left px-2 py-1.5 text-xs text-slate-200 hover:bg-slate-700 rounded-md transition-colors"
                                >
                                    {p.name}
                                </button>
                            ))}
                            <button
                                onClick={(e) => { e.stopPropagation(); setAddingToPlaylistCard(null); }}
                                className="text-center mt-1 text-[10px] text-slate-500 hover:text-slate-400"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {filteredCardsCount === 0 && (
                <div className="col-span-full text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No cards found for this rarity filter.
                </div>
            )}
        </div>
    );
}
