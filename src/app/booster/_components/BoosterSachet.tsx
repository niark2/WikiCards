"use client";

import { motion } from "framer-motion";
import { BoosterTheme } from "../_hooks/useBoosterPack";

interface BoosterSachetProps {
    selectedTheme: BoosterTheme;
    onClick: () => void;
    isOpening?: boolean;
}

export function BoosterSachet({ selectedTheme, onClick, isOpening = false }: BoosterSachetProps) {
    return (
        <div className="flex-1 flex items-center justify-center py-2 min-h-0 relative">
            <motion.div
                whileHover={!isOpening ? { scale: 1.05 } : {}}
                whileTap={!isOpening ? { scale: 0.98 } : {}}
                animate={isOpening ? {
                    scale: [1, 1.02, 0.95, 1],
                    y: [0, -2, 4, -4, 0],
                    rotate: [0, -1, 1, -0.5, 0],
                } : { y: [0, -10, 0] }}
                transition={isOpening
                    ? { duration: 1.2, ease: "easeInOut", times: [0, 0.2, 0.5, 1] }
                    : { y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
                }
                className={`booster-sachet group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] cursor-pointer ${selectedTheme.id === 'uranium' ? 'nuclear-glow' : ''}`}
                style={{
                    "--theme-color": selectedTheme.color,
                    "--theme-dark": selectedTheme.dark,
                    "--theme-light": selectedTheme.light,
                    overflow: isOpening ? 'visible' : 'hidden'
                } as React.CSSProperties}
                onClick={!isOpening ? onClick : undefined}
            >
                {/* Uranium pulsing core */}
                {selectedTheme.id === 'uranium' && (
                    <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#22c55e44_0%,_transparent_70%)] pointer-events-none z-0"
                    />
                )}

                {/* The torn seal flying off */}
                {!isOpening && <div className="booster-sachet-seal top" />}

                {/* The strip that gets torn off from the right */}
                {isOpening && (
                    <motion.div
                        className="absolute top-0 left-0 right-0 z-40 origin-bottom-left"
                        style={{ height: '30px' }}
                        initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                        animate={{
                            y: [0, -30, -100],         // lifts up
                            x: [0, -50, -150],         // pulls to the left
                            rotate: [-10, -50, -90],   // hinge at bottom-left rotates it over
                            opacity: [1, 1, 0],        // fades out entirely
                        }}
                        transition={{ duration: 0.9, ease: "easeIn" }}
                    >
                        {/* The zig-zag top seal itself */}
                        <div className="absolute inset-0 booster-sachet-seal !top-0 !bottom-auto" />

                        {/* The jagged torn edge at the bottom of the flying piece */}
                        <div className="absolute bottom-[-3px] left-0 right-0 h-[4px] bg-[var(--theme-color)] overflow-hidden opacity-90 brightness-75">
                            <svg className="w-full h-full text-black/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                                <polygon fill="currentColor" points="0,0 3,7 6,1 9,9 12,2 15,10 18,1 21,8 24,0 27,9 30,2 33,10 36,1 39,8 42,0 45,9 48,2 51,10 54,1 57,8 60,0 63,9 66,2 69,10 72,1 75,8 78,0 81,9 84,2 87,10 90,1 93,8 96,0 100,9 100,0 0,0" />
                            </svg>
                        </div>
                    </motion.div>
                )}

                {/* The stationary bottom seal */}
                <div className="booster-sachet-seal bottom" />

                {/* The dark "hole" revealed inside the sachet after tearing */}
                <div
                    className={`absolute top-0 left-0 right-0 bg-zinc-950 shadow-inner z-20 transition-opacity duration-150 ${isOpening ? 'opacity-100' : 'opacity-0'}`}
                    style={{ height: '30px', borderBottom: '2px solid rgba(0,0,0,0.5)' }}
                />

                {/* The jagged torn edge that remains ATTACHED to the sachet */}
                {isOpening && (
                    <div className="absolute top-[28px] left-0 right-0 h-[4px] bg-[var(--theme-color)] z-20 overflow-hidden opacity-80 brightness-110">
                        <svg className="w-full h-full text-zinc-900/50" preserveAspectRatio="none" viewBox="0 0 100 10">
                            <polygon fill="currentColor" points="0,10 3,3 6,9 9,1 12,8 15,0 18,9 21,2 24,10 27,1 30,8 33,0 36,9 39,2 42,10 45,1 48,8 51,0 54,9 57,2 60,10 63,1 66,8 69,0 72,9 75,2 78,10 81,1 84,8 87,0 90,9 93,2 96,10 100,1 100,10 0,10" />
                        </svg>
                    </div>
                )}

                <div className="booster-sachet-content">
                    {/* Glossy top highlight */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                    <div className="w-full flex flex-col items-center pt-8">
                        {/* The Globe */}
                        <div className="w-28 h-28 md:w-44 md:h-44 relative mb-4 md:mb-6 drop-shadow-lg">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg"
                                alt="Wikipedia Globe"
                                className="w-full h-full object-contain filter grayscale brightness-[0.7] contrast-[1.1] opacity-90 mix-blend-darken"
                            />
                        </div>

                        {/* WikiCards Text */}
                        <div className="mix-blend-multiply opacity-70 mb-4">
                            <h2 className="font-sans text-xl md:text-3xl tracking-[0.15em] text-black font-semibold leading-none">
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12">
            <motion.div
                animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.98, 1, 0.98]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative"
            >
                <div className="w-24 h-24 md:w-32 md:h-32 opacity-80 contrast-[0.9]">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg"
                        alt="Wikipedia Loading"
                        className="w-full h-full object-contain"
                    />
                </div>
            </motion.div>

            <div className="flex flex-col items-center gap-1">
                <p className="text-white/80 font-sans text-xs md:text-sm font-bold tracking-[1.2em] uppercase ml-[1.2em]">
                    Scanning
                </p>
                <motion.div
                    className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
        </div>
    );
}

