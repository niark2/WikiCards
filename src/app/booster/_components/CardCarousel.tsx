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
    sellAll?: () => void;
    sellCommon?: () => void;
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
    sellAll,
    sellCommon,
}: CardCarouselProps) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className={`relative w-full max-w-4xl h-[380px] md:h-[500px] flex items-center justify-center transition-all duration-700 ease-in-out ${revealed.length === cards.length ? '-translate-y-16 md:-translate-y-20 scale-[0.90] md:scale-95' : ''}`}>
                <AnimatePresence>
                    {cards.map((card, idx) => {
                        const isCardRevealed = revealed.includes(idx);
                        const offset = idx - currentIndex;
                        const isActive = offset === 0;

                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                        const xOffset = offset * (isMobile ? 55 : 90);
                        const scale = isActive ? 1.05 : 1 - Math.abs(offset) * 0.1;
                        const zIndex = 10 - Math.abs(offset);
                        const rotateY = offset * -5;

                        return (
                            <motion.div
                                key={card.id + idx}
                                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                animate={{
                                    opacity: Math.abs(offset) > 2 ? 0 : isActive ? 1 : 0.7,
                                    scale: scale,
                                    y: isActive ? -10 : 0,
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
                            className={`absolute left-1 md:left-4 lg:left-12 top-1/2 -translate-y-1/2 w-10 h-20 md:w-16 md:h-32 rounded-full border border-white/10 bg-black/40 backdrop-blur flex items-center justify-center transition-opacity hover:bg-black/60 hover:scale-105 active:scale-95 z-20 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            <ChevronLeft className="w-5 h-5 md:w-8 md:h-8 text-white/50" />
                        </button>
                        <button
                            onClick={goToNextCard}
                            className={`absolute right-1 md:right-4 lg:right-12 top-1/2 -translate-y-1/2 w-10 h-20 md:w-16 md:h-32 rounded-full border border-white/10 bg-black/40 backdrop-blur flex items-center justify-center transition-opacity hover:bg-black/60 hover:scale-105 active:scale-95 z-20 ${currentIndex === cards.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            <ChevronRight className="w-5 h-5 md:w-8 md:h-8 text-white/50" />
                        </button>
                    </>
                )}
            </div>

            {revealed.length === cards.length && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 md:gap-6 bg-slate-900/60 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-30 w-[calc(100%-2rem)] md:w-auto"
                >
                    <p className="text-lg md:text-2xl text-amber-100 font-serif font-black italic tracking-tight text-center">
                        5 New Cards Discovered
                    </p>
                    <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 w-full">
                        <button
                            onClick={resetPack}
                            className="px-4 md:px-6 py-3 md:py-3.5 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl hover:bg-amber-400 transition-all shadow-[0_10px_30px_rgba(245,158,11,0.3)] active:scale-95 text-center flex-1 sm:flex-none min-w-[120px] md:min-w-[150px]"
                        >
                            Summon Another
                        </button>
                        <a
                            href="/collection"
                            className="px-4 md:px-6 py-3 md:py-3.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl transition-all border border-white/10 backdrop-blur active:scale-95 text-center flex-1 sm:flex-none min-w-[120px] md:min-w-[150px]"
                        >
                            To Collection
                        </a>
                        <button
                            onClick={sellAll}
                            className="px-4 md:px-6 py-3 md:py-3.5 bg-red-950/40 hover:bg-red-900/40 text-red-400 font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl transition-all border border-red-500/20 active:scale-95 text-center flex-1 sm:flex-none min-w-[120px] md:min-w-[150px]"
                        >
                            Sell All
                        </button>
                        <button
                            onClick={sellCommon}
                            className="px-4 md:px-6 py-3 md:py-3.5 bg-slate-800/40 hover:bg-slate-700/40 text-slate-300 font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl transition-all border border-white/10 active:scale-95 text-center flex-1 sm:flex-none min-w-[120px] md:min-w-[150px]"
                        >
                            Sell Common
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
