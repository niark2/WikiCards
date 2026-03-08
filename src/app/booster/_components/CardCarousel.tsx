"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WikiCard } from "@/types";
import { Card } from "@/components/Card";
import { Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { BoosterTheme } from "../_hooks/useBoosterPack";

interface CardCarouselProps {
    cards: WikiCard[];
    revealed: number[];
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    goToPreviousCard: () => void;
    goToNextCard: () => void;
    selectedTheme: BoosterTheme;
    resetPack: () => void;
}

export function CardCarousel({
    cards,
    revealed,
    currentIndex,
    setCurrentIndex,
    goToPreviousCard,
    goToNextCard,
    selectedTheme,
    resetPack,
}: CardCarouselProps) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className={`relative w-full max-w-4xl h-[500px] flex items-center justify-center transition-all duration-700 ease-in-out ${revealed.length === cards.length ? '-translate-y-32 scale-90' : ''}`}>
                <AnimatePresence>
                    {cards.map((card, idx) => {
                        const isCardRevealed = revealed.includes(idx);
                        const offset = idx - currentIndex;
                        const isActive = offset === 0;

                        const xOffset = offset * 80;
                        const scale = 1 - Math.abs(offset) * 0.08;
                        const zIndex = 10 - Math.abs(offset);
                        const rotateY = offset * -5;

                        return (
                            <motion.div
                                key={card.id + idx}
                                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                animate={{
                                    opacity: Math.abs(offset) > 2 ? 0 : isActive ? 1 : 0.6,
                                    scale: scale,
                                    y: isActive ? -20 : 0,
                                    x: xOffset,
                                    rotateY: rotateY,
                                    zIndex: zIndex
                                }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="absolute cursor-pointer will-change-transform transform-gpu"
                                style={{ perspective: "1000px" }}
                                onClick={() => setCurrentIndex(idx)}
                            >
                                <motion.div
                                    animate={{ rotateY: isCardRevealed ? 0 : 180 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    style={{ transformStyle: "preserve-3d" }}
                                    className="shadow-2xl rounded-2xl transform-gpu"
                                >
                                    {isCardRevealed ? (
                                        <Card card={card} />
                                    ) : (
                                        <div
                                            className="booster-sachet !w-64 !h-96 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                                            style={{
                                                "--theme-color": selectedTheme.color,
                                                "--theme-dark": selectedTheme.dark,
                                                "--theme-light": selectedTheme.light,
                                            } as React.CSSProperties}
                                        >
                                            <div className="booster-sachet-seal top !h-4" />
                                            <div className="booster-sachet-seal bottom !h-4" />
                                            <div className="booster-sachet-content !p-8 opacity-40">
                                                <Layers className="w-12 h-12 text-black/30" />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Navigation Arrows */}
                {revealed.length > 0 && (
                    <>
                        <button
                            onClick={goToPreviousCard}
                            className={`absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 w-16 h-32 rounded-full border border-white/10 bg-black/40 backdrop-blur flex items-center justify-center transition-opacity hover:bg-black/60 hover:scale-105 active:scale-95 z-20 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            <ChevronLeft className="w-8 h-8 text-white/50" />
                        </button>
                        <button
                            onClick={goToNextCard}
                            className={`absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 w-16 h-32 rounded-full border border-white/10 bg-black/40 backdrop-blur flex items-center justify-center transition-opacity hover:bg-black/60 hover:scale-105 active:scale-95 z-20 ${currentIndex === cards.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            <ChevronRight className="w-8 h-8 text-white/50" />
                        </button>
                    </>
                )}
            </div>

            {revealed.length === cards.length && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 bg-slate-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-30"
                >
                    <p className="text-2xl text-amber-100 font-serif font-black italic tracking-tight">
                        5 New Cards Discovered
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={resetPack}
                            className="px-10 py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-amber-400 transition-all shadow-[0_10px_30px_rgba(245,158,11,0.3)] active:scale-95"
                        >
                            Summon Another
                        </button>
                        <a
                            href="/collection"
                            className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all border border-white/10 backdrop-blur active:scale-95"
                        >
                            To Collection
                        </a>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
