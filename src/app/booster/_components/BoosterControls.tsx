"use client";

import { Coins, Sparkles } from "lucide-react";
import { BoosterTheme, THEMES } from "../_hooks/useBoosterPack";

interface ThemeSelectorProps {
    selectedThemeId: string;
    setSelectedThemeId: (id: string) => void;
}

export function ThemeSelector({ selectedThemeId, setSelectedThemeId }: ThemeSelectorProps) {
    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">Select Edition</span>
            <div className="flex flex-wrap justify-center gap-2">
                {THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => setSelectedThemeId(theme.id)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-2 border ${selectedThemeId === theme.id
                            ? 'bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                            : 'bg-transparent text-slate-500 border-white/5 hover:border-white/10'
                            }`}
                    >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.color }} />
                        {theme.label.split(' ')[0]}
                    </button>
                ))}
            </div>
        </div>
    );
}

interface OpenButtonProps {
    onClick: () => void;
    loading: boolean;
    coins: number;
    cost: number;
    selectedTheme: BoosterTheme;
    isStandardFree: boolean;
    freeRemaining: number;
    selectedThemeId: string;
}

export function OpenButton({
    onClick,
    loading,
    coins,
    cost,
    selectedTheme,
    isStandardFree,
    freeRemaining,
    selectedThemeId,
}: OpenButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={loading || coins < cost}
            style={{ backgroundColor: selectedTheme.color }}
            className="w-full max-w-md px-10 py-5 text-black font-black rounded-2xl transition-all hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-base flex flex-col items-center justify-center gap-0 shadow-xl"
        >
            <span className="flex items-center gap-3">
                Summon {selectedTheme.label.split(' ')[0]}
                {cost > 0 && (
                    <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded text-xs">
                        <Coins className="w-3.5 h-3.5" />
                        {cost}
                    </span>
                )}
            </span>
            {selectedThemeId === "" && isStandardFree && (
                <span className="text-[10px] opacity-70 font-bold mt-1 tracking-normal italic flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {freeRemaining} daily boosters remaining
                </span>
            )}
        </button>
    );
}
