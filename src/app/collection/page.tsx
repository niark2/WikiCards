"use client";

import { Layers } from "lucide-react";
import { useCollectionState } from "./_hooks/useCollectionState";
import { CollectionHeader } from "./_components/CollectionHeader";
import { FolderList } from "./_components/FolderList";
import { CardGrid } from "./_components/CardGrid";
import { SelectionBar } from "./_components/SelectionBar";

export default function CollectionPage() {
    const state = useCollectionState();

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden pt-24 pb-20">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <CollectionHeader
                    groupedCardsCount={state.groupedCards.length}
                    totalCardsCount={state.cards.length}
                    totalValue={state.totalCollectionValue}
                    filter={state.filter}
                    setFilter={state.setFilter}
                    sortBy={state.sortBy}
                    setSortBy={state.setSortBy}
                    cardSelectionMode={state.cardSelectionMode}
                    toggleSelectionMode={state.toggleSelectionMode}
                    handleExport={state.handleExport}
                    handleImport={state.handleImport}
                    isExporting={state.isExporting}
                    isImporting={state.isImporting}
                />

                <FolderList
                    playlists={state.playlists}
                    activePlaylist={state.activePlaylist}
                    setActivePlaylist={state.setActivePlaylist}
                    handleCreatePlaylist={state.handleCreatePlaylist}
                    totalCardsCount={state.cards.length}
                    groupedCardsCount={state.groupedCards.length}
                    filteredCardsCount={state.filteredCards.length}
                />

                {state.cards.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                            <Layers className="w-10 h-10 text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-serif text-slate-300 mb-2">No cards yet</h2>
                        <p className="text-slate-500 mb-8 max-w-md">
                            Your collection is empty. Open some boosters to start discovering the knowledge of humanity.
                        </p>
                        <a href="/booster" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-colors">
                            Open First Booster
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        <CardGrid
                            visibleCards={state.visibleCards}
                            filteredCardsCount={state.filteredCards.length}
                            cardSelectionMode={state.cardSelectionMode}
                            selectedCardIds={state.selectedCardIds}
                            addingToPlaylistCard={state.addingToPlaylistCard}
                            activePlaylist={state.activePlaylist}
                            playlists={state.playlists}
                            toggleCardSelection={state.toggleCardSelection}
                            handleDiscard={state.handleDiscard}
                            handleRemoveFromPlaylist={state.handleRemoveFromPlaylist}
                            handleAddToPlaylist={state.handleAddToPlaylist}
                            setAddingToPlaylistCard={state.setAddingToPlaylistCard}
                        />

                        {state.displayLimit < state.groupedCards.length && (
                            <div className="mt-8 flex justify-center pb-20">
                                <button
                                    onClick={state.loadMore}
                                    className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-white/5 transition-all hover:scale-105 active:scale-95"
                                >
                                    Load More Cards ({state.groupedCards.length - state.displayLimit} remaining)
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {state.cardSelectionMode && (
                    <SelectionBar
                        selectedCount={state.selectedCardIds.length}
                        playlists={state.playlists}
                        handleBatchDiscard={state.handleBatchDiscard}
                        handleBatchAddToPlaylist={state.handleBatchAddToPlaylist}
                    />
                )}
            </div>
        </div>
    );
}
