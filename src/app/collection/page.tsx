"use client";

import { Layers } from "lucide-react";
import { useCollectionState } from "./_hooks/useCollectionState";
import { CollectionHeader } from "./_components/CollectionHeader";
import { FolderList } from "./_components/FolderList";
import { CardGrid } from "./_components/CardGrid";
import { SelectionBar } from "./_components/SelectionBar";
import { BinderGrid } from "./_components/binders/BinderGrid";
import { BINDERS } from "@/lib/binders/config";
import { Grid, Book } from "lucide-react";

export default function CollectionPage() {
    const state = useCollectionState();

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden pt-8 md:pt-12 pb-20">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 py-2">
                {/* Tab Switcher */}
                <div className="flex justify-center mb-4">
                    <div className="bg-slate-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 flex gap-1 shadow-2xl">
                        <button
                            onClick={() => state.setActiveTab('inventory')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${state.activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Grid className="w-4 h-4" /> Inventory
                        </button>
                        <button
                            onClick={() => state.setActiveTab('binders')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${state.activeTab === 'binders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Book className="w-4 h-4" /> Albums
                        </button>
                    </div>
                </div>

                {state.activeTab === 'inventory' ? (
                    <>
                        <CollectionHeader
                            groupedCardsCount={state.groupedCards.length}
                            totalCardsCount={state.cards.length}
                            totalValue={state.totalCollectionValue}
                            filter={state.filter}
                            setFilter={state.setFilter}
                            searchQuery={state.searchQuery}
                            setSearchQuery={state.setSearchQuery}
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
                            handleDeletePlaylist={state.handleDeletePlaylist}
                            handleRenamePlaylist={state.handleRenamePlaylist}
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
                    </>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-white mb-2">My Albums</h2>
                            <p className="text-slate-500">Complete these thematic sets to earn massive rewards.</p>
                        </div>
                        <BinderGrid
                            binders={BINDERS}
                            progressions={state.binderProgressions}
                            claimedBinderIds={state.claimedBinderIds}
                            collection={state.cards}
                            onClaimReward={state.handleClaimBinderReward}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
