"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { BoosterTheme } from "../_hooks/useBoosterPack";

interface BoosterSachetProps {
    selectedTheme: BoosterTheme;
    onClick: () => void;
}

export function BoosterSachet({ selectedTheme, onClick }: BoosterSachetProps) {
    return (
        <div className="flex-1 flex items-center justify-center py-2 min-h-0">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                className="booster-sachet group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] cursor-pointer"
                style={{
                    "--theme-color": selectedTheme.color,
                    "--theme-dark": selectedTheme.dark,
                    "--theme-light": selectedTheme.light,
                } as React.CSSProperties}
                onClick={onClick}
            >
                <div className="booster-sachet-seal top" />
                <div className="booster-sachet-seal bottom" />

                <div className="booster-sachet-content">
                    {/* Glossy top highlight */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                    <div className="w-full flex flex-col items-center pt-8">
                        {/* The Globe */}
                        <div className="w-44 h-44 relative mb-6 drop-shadow-lg">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg"
                                alt="Wikipedia Globe"
                                className="w-full h-full object-contain filter grayscale brightness-[0.7] contrast-[1.1] opacity-90 mix-blend-darken"
                            />
                        </div>

                        {/* WikiCards Text */}
                        <div className="mix-blend-multiply opacity-70 mb-4">
                            <h2 className="font-sans text-3xl tracking-[0.15em] text-black font-semibold leading-none">
                                WIKICARDS
                            </h2>
                        </div>

                    </div>

                    <div className="mt-auto flex flex-col items-center gap-2 pb-10">
                        {/* CC License badge - Matching reference */}
                        <div className="flex items-center gap-1.5 opacity-70 mix-blend-multiply scale-90">
                            <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center">
                                <span className="text-[8px] font-black text-black">CC</span>
                            </div>
                            <div className="h-6 px-1.5 border-2 border-black rounded-sm flex items-center justify-center">
                                <span className="text-[9px] font-black text-black tracking-widest leading-none">BY-SA</span>
                            </div>
                        </div>
                        <p className="text-[9px] text-black/70 font-bold tracking-tight mix-blend-multiply text-center max-w-[180px] leading-tight mt-1 uppercase">
                            Content is available under <br /> CC BY-SA 4.0
                        </p>
                    </div>

                    {/* Side shadows for volume */}
                    <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                </div>
            </motion.div>
        </div>
    );
}

export function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
            <div className="w-24 h-24 border-2 border-amber-500/20 rounded-full flex items-center justify-center relative">
                <motion.div
                    className="absolute inset-0 border-t-2 border-amber-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <Layers className="w-10 h-10 text-amber-500 animate-pulse" />
            </div>
            <p className="text-amber-500 font-sans text-xs tracking-[0.6em] uppercase animate-pulse">Scanning Wikipedia...</p>
        </div>
    );
}
