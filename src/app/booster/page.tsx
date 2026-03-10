"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBoosterPack, BoosterTheme } from "./_hooks/useBoosterPack";
import { useSound } from "@/hooks/useSound";
import { BoosterSachet, LoadingSpinner } from "./_components/BoosterSachet";
import { OpenButton } from "./_components/BoosterControls";
import { CardCarousel } from "./_components/CardCarousel";
import { Sparkles, Shield, Scroll, Atom, Palette, Trophy, Zap, Flag, Ghost, Hammer } from "lucide-react";

function ThemeIcon({ theme, className = "", style = {} }: { theme: BoosterTheme, className?: string, style?: React.CSSProperties }) {
    const iconName = theme.icon || "Sparkles";

    switch (iconName) {
        case "Hammer":
        case "hammer": return <Hammer className={className} style={style} />;
        case "Shield": return <Shield className={className} style={style} />;
        case "Scroll": return <Scroll className={className} style={style} />;
        case "Atom": return <Atom className={className} style={style} />;
        case "Palette": return <Palette className={className} style={style} />;
        case "Trophy": return <Trophy className={className} style={style} />;
        case "Zap": return <Zap className={className} style={style} />;
        case "Flag": return <Flag className={className} style={style} />;
        case "Ghost": return <Ghost className={className} style={style} />;
        case "Sparkles":
        default:
            return <Sparkles className={className} style={style} />;
    }
}

export default function BoosterPage() {
    const booster = useBoosterPack();
    const { playBoosterOpenSound } = useSound();
    const [isTearing, setIsTearing] = useState(false);

    const handleOpenBooster = async () => {
        if (booster.cost > 0 && booster.coins < booster.cost) {
            alert("Not enough WikiCoins! Discard cards in your collection to get more.");
            return;
        }

        if (isTearing || booster.loading) return;

        playBoosterOpenSound();
        setIsTearing(true);
        setTimeout(() => {
            setIsTearing(false);
            booster.openBooster();
        }, 1200);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] relative w-full overflow-hidden bg-slate-950 items-stretch">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            {!booster.cards && (
                <div className="flex flex-col md:flex-row w-full flex-1">
                    {/* Left Sidebar for Editions — on mobile: horizontal strip at top */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-72 bg-slate-900/40 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-white/5 p-3 md:p-5 flex md:flex-col gap-3 md:gap-7 z-20 overflow-x-auto md:overflow-x-visible md:overflow-y-auto md:min-h-full"
                    >
                        {/* Title — hidden on mobile, shown on desktop */}
                        <div className="hidden md:flex flex-col gap-1.5 text-left">
                            <span className="text-[9px] font-black tracking-[0.4em] text-indigo-500 uppercase">Library</span>
                            <h2 className="text-2xl font-serif font-black text-white leading-none">Choose an <span className="text-indigo-400">Edition</span></h2>
                        </div>

                        {/* Mobile: horizontal flat list / Desktop: categorized list */}
                        <div className="flex md:hidden gap-2 items-center flex-nowrap min-w-max">
                            {booster.availableThemes.map((theme: BoosterTheme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => booster.setSelectedThemeId(theme.id)}
                                    className={`
                                        shrink-0 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border whitespace-nowrap
                                        ${booster.selectedThemeId === theme.id
                                            ? theme.category === 'ephemeral'
                                                ? 'bg-red-950/20 border-red-500/30 text-white'
                                                : 'bg-white/5 border-white/20 text-white'
                                            : 'bg-transparent border-transparent text-slate-500'
                                        }
                                    `}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                        <ThemeIcon theme={theme} className="w-4 h-4" style={{ color: theme.color }} />
                                    </div>
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-wider">{theme.label.replace(' Edition', '')}</span>
                                        {theme.description && (
                                            <span className="text-[8px] font-bold text-slate-400 capitalize leading-none">{theme.description}</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Desktop: categorized list */}
                        <div className="hidden md:flex flex-col gap-6">
                            {/* Classic Category */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 px-2 mb-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <span className="text-[7px] font-black tracking-[0.4em] text-indigo-500 uppercase">Classic Editions</span>
                                </div>
                                {booster.availableThemes.filter(t => t.category === 'classic').map((theme: BoosterTheme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => booster.setSelectedThemeId(theme.id)}
                                        className={`
                                            group relative w-full p-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 border text-left
                                            ${booster.selectedThemeId === theme.id
                                                ? 'bg-white/5 border-white/20 shadow-lg'
                                                : 'bg-transparent border-transparent hover:bg-white/5 text-slate-500 hover:text-slate-300'
                                            }
                                        `}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-105"
                                            style={{ backgroundColor: `${theme.color}15`, borderColor: `${theme.color}30` }}
                                        >
                                            <ThemeIcon theme={theme} className="w-4 h-4" style={{ color: theme.color }} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${booster.selectedThemeId === theme.id ? 'text-white' : ''}`}>
                                                {theme.label.replace(' Edition', '')}
                                            </span>
                                            {theme.description && (
                                                <span className="text-[9px] font-bold text-slate-400">{theme.description}</span>
                                            )}
                                        </div>
                                        {booster.selectedThemeId === theme.id && (
                                            <motion.div
                                                layoutId="active-booster"
                                                className="absolute right-3 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white]"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>


                            {/* Ephemeral Category */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 px-2 mb-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    <span className="text-[7px] font-black tracking-[0.4em] text-rose-500 uppercase">Ephemeral</span>
                                </div>
                                {booster.availableThemes.filter(t => t.category === 'ephemeral').map((theme: BoosterTheme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => booster.setSelectedThemeId(theme.id)}
                                        className={`
                                            group relative w-full p-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 border text-left
                                            ${booster.selectedThemeId === theme.id
                                                ? 'bg-red-950/20 border-red-500/30 shadow-[0_0_10px_rgba(255,0,0,0.1)]'
                                                : 'bg-transparent border-transparent hover:bg-white/5 text-slate-500 hover:text-slate-300'
                                            }
                                        `}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-105"
                                            style={{ backgroundColor: `${theme.color}15`, borderColor: `${theme.color}30` }}
                                        >
                                            <ThemeIcon theme={theme} className="w-4 h-4" style={{ color: theme.color }} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${booster.selectedThemeId === theme.id ? 'text-white' : ''}`}>
                                                {theme.label.replace(' Edition', '')}
                                            </span>
                                            {theme.description && (
                                                <span className="text-[9px] font-bold text-slate-400">{theme.description}</span>
                                            )}
                                        </div>
                                        {booster.selectedThemeId === theme.id && (
                                            <motion.div
                                                layoutId="active-booster"
                                                className="absolute right-3 w-1 h-1 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,0,0,0.6)]"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden">
                        {booster.loading ? (
                            <LoadingSpinner />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-full flex flex-col items-center justify-center"
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle at center, ${booster.selectedTheme.color}33 0%, transparent 70%)`
                                    }}
                                />

                                <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12 max-w-2xl w-full">
                                    <BoosterSachet
                                        selectedTheme={booster.selectedTheme}
                                        onClick={handleOpenBooster}
                                        isOpening={isTearing}
                                    />

                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <OpenButton
                                            onClick={handleOpenBooster}
                                            loading={booster.loading || isTearing}
                                            coins={booster.coins}
                                            cost={booster.cost}
                                            selectedTheme={booster.selectedTheme}
                                            isStandardFree={booster.isStandardFree}
                                            freeRemaining={booster.freeRemaining}
                                            selectedThemeId={booster.selectedThemeId}
                                        />
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] animate-pulse">
                                            Click on the booster to summon it
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {booster.cards && !booster.loading && (
                <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-2 md:p-6">
                    <CardCarousel
                        cards={booster.cards}
                        revealed={booster.revealed}
                        currentIndex={booster.currentIndex}
                        setCurrentIndex={booster.setCurrentIndex}
                        goToPreviousCard={booster.goToPreviousCard}
                        goToNextCard={booster.goToNextCard}
                        selectedTheme={booster.selectedTheme}
                        resetPack={booster.resetPack}
                    />
                </div>
            )}
        </div>
    );
}
