"use client";

import { Binder, BinderProgress } from "@/lib/binders/types";
import { WikiCard } from "@/types";
import { X, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import { RARITY_COLORS } from "@/lib/rarity";

interface BinderDetailsModalProps {
    binder: Binder;
    progress: BinderProgress;
    collection: WikiCard[];
    onClose: () => void;
}

export function BinderDetailsModal({ binder, progress, collection, onClose }: BinderDetailsModalProps) {
    const foundCards = collection.filter(c => progress.foundCardIds.includes(c.id));
    
    // Create an array of targetCount size to show slots
    const slots = Array.from({ length: binder.targetCount });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-indigo-500/20 rounded-xl">
                                <Trophy className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{binder.title}</h2>
                                <p className="text-slate-400 text-sm">{binder.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {slots.map((_, idx) => {
                                const card = foundCards[idx];
                                
                                if (card) {
                                    return (
                                        <div key={card.id} className="relative group flex flex-col items-center">
                                            {/* Larger height for the card slot */}
                                            <div className="w-full h-72 relative flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
                                                {/* Increased scale from 0.48 to 0.72 for better visibility */}
                                                <div className="flex-shrink-0 pointer-events-none" style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
                                                    <Card card={card} hideLink />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={`empty-${idx}`} className="h-72 relative rounded-2xl overflow-hidden border-2 border-dashed border-white/5 bg-slate-950/40 flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                                <span className="text-slate-600 text-xl font-bold">?</span>
                                            </div>
                                            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Card Needed</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 bg-slate-900/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 font-medium tracking-wider">TOTAL PROGRESS:</span>
                            <span className={`text-lg font-black ${progress.isCompleted ? 'text-indigo-400' : 'text-slate-300'}`}>
                                {progress.currentCount} / {binder.targetCount}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-bold mb-1 tracking-widest uppercase">COMPLETION REWARD</p>
                            <p className="text-xl font-black text-amber-500 flex items-center gap-1 justify-end">
                                {binder.reward} <span className="text-xs tracking-tight text-amber-600/80">WC</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
