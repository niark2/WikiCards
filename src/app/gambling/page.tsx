"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Coins, Trophy, RefreshCw, Star, Dices, CircleOff } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/useToast";
import { saveCollection, logActivity } from "@/lib/storage";
import { Card } from "@/components/Card";
import { WikiCard } from "@/types";

const SPIN_COST = 80;

interface Reward {
    id: number;
    type: 'coins' | 'card' | 'multiplier';
    label: string;
    value: number | string;
    chance: number;
    color: string;
}

const REWARDS: Reward[] = [
    { id: 0, type: 'coins', label: "PERDU", value: 0, chance: 0.45, color: "#1e293b" },
    { id: 1, type: 'coins', label: "GAIN PIÈCES", value: 250, chance: 0.30, color: "#6366f1" },
    { id: 2, type: 'card', label: "CARTE RARE", value: "Epic", chance: 0.20, color: "#ec4899" },
    { id: 3, type: 'coins', label: "JACKPOT", value: 1000, chance: 0.05, color: "#f59e0b" },
];

export default function GamblingPage() {
    const { addCoins, deductCoins } = useCoins();
    const { playCoinSound, playRevealSound, playDrawSound } = useSound();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<Reward | null>(null);
    const [wonCard, setWonCard] = useState<WikiCard | null>(null);
    const { showToast } = useToast();
    const controls = useAnimation();
    const wheelRef = useRef<HTMLDivElement>(null);

    const handleSpin = async () => {
        if (isSpinning) return;

        if (deductCoins(SPIN_COST)) {
            setIsSpinning(true);
            setResult(null);
            setWonCard(null);
            logActivity('coins_added', `Bet ${SPIN_COST} on the WikiWheel`, -SPIN_COST);

            const roll = Math.random();
            let cumulativeChance = 0;
            let winningReward = REWARDS[0];

            for (const reward of REWARDS) {
                cumulativeChance += reward.chance;
                if (roll <= cumulativeChance) {
                    winningReward = reward;
                    break;
                }
            }

            const segmentAngle = 360 / REWARDS.length;
            const extraSpins = 5 + Math.floor(Math.random() * 5);
            const targetSegment = winningReward.id;

            // Fix: Calculate absolute rotation to ensure it always lands on the correct segment
            const currentFullSpins = Math.floor(rotation / 360);
            const newRotation = (currentFullSpins + extraSpins + 2) * 360 + (targetSegment * segmentAngle);
            setRotation(newRotation);

            const interval = setInterval(() => {
                playDrawSound();
            }, 300);

            await controls.start({
                rotate: -newRotation,
                transition: { duration: 4, ease: [0.15, 0, 0.15, 1] }
            });

            clearInterval(interval);

            handleWin(winningReward);
            setIsSpinning(false);
        } else {
            showToast("❌ Pas assez de WikiCoins !", "error");
        }
    };

    const handleWin = async (reward: Reward) => {
        setResult(reward);

        if (reward.id === 1) { // GAIN PIÈCES Quadrant
            const roll = Math.random();
            let amount = 50;
            if (roll > 0.90) amount = 200;      // 10% chance
            else if (roll > 0.60) amount = 100; // 30% chance
            // 60% chance for 50

            addCoins(amount);
            playCoinSound();
            setResult({ ...reward, value: amount, label: `${amount} PIÈCES` });
            logActivity('coins_added', `Won ${amount} WikiCoins from WikiWheel`, amount);
            showToast(`💰 Vous avez gagné ${amount} WikiCoins !`, "success");

        } else if (reward.id === 3) { // JACKPOT Quadrant
            addCoins(1000);
            playCoinSound();
            logActivity('coins_added', `Won JACKPOT (1000) from WikiWheel`, 1000);
            showToast("🎉 JACKPOT ! 1000 WikiCoins !", "success");

        } else if (reward.type === 'card') {
            const roll = Math.random();
            const rarity = roll > 0.80 ? 'Legendary' : 'Epic'; // 80% Epic, 20% Legendary

            const { generateNaturalCard } = await import("@/lib/wiki/booster");
            const card = await generateNaturalCard(rarity as 'Epic' | 'Legendary');

            if (card) {
                saveCollection([card]);
                setWonCard(card);
                playRevealSound(card.rarity);
                setResult({ ...reward, value: card.rarity, label: `CARTE ${card.rarity === 'Epic' ? 'ÉPIQUE' : 'LÉGENDE'}` });
                logActivity('card_bought', `Won ${card.rarity} card: ${card.title} from WikiWheel`, 0);
                showToast(`✨ Vous avez gagné une carte ${card.rarity} !`, "success");
            }
        } else if (reward.id === 0) {
            showToast("😔 Perdu... Réessayez !", "info");
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden pt-8 pb-8 font-sans">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-6">
                    <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tighter mb-1">
                        Wiki<span className="text-indigo-500">Wheel</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] md:text-xs max-w-md mx-auto font-medium uppercase tracking-[0.2em]">
                        Mise {SPIN_COST} WikiCoins • 4 Quadrants
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                    {/* Wheel Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-[200px] h-[200px] md:w-[280px] md:h-[280px]">
                            {/* Needle / Pointer */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
                                <div
                                    className="w-5 h-7 bg-white rounded-sm shadow-xl relative"
                                    style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
                                />
                            </div>

                            {/* The Wheel */}
                            <motion.div
                                ref={wheelRef}
                                animate={controls}
                                className="w-full h-full rounded-full border-[14px] border-slate-900 shadow-[0_0_80px_rgba(99,102,241,0.4),inset_0_0_60px_rgba(0,0,0,0.9)] overflow-hidden relative bg-slate-950"
                            >
                                {REWARDS.map((reward, i) => {
                                    const angle = 360 / REWARDS.length;
                                    const rotate = i * angle;
                                    return (
                                        <div
                                            key={reward.id}
                                            className="absolute inset-0"
                                            style={{
                                                transform: `rotate(${rotate - 90}deg)`,
                                            }}
                                        >
                                            {/* Segment Background */}
                                            <div
                                                className="absolute top-0 left-1/2 w-1/2 h-full origin-left"
                                                style={{
                                                    backgroundColor: reward.color,
                                                    opacity: 0.9,
                                                    clipPath: 'polygon(0 50%, 100% 0, 100% 100%)'
                                                }}
                                            />

                                            {/* Icon - Centered in the segment slice */}
                                            <div
                                                className="absolute top-1/2 left-1/2 w-1/2 -translate-y-1/2 origin-left flex items-center justify-end pr-8 md:pr-12"
                                            >
                                                <div className="flex flex-col items-center -rotate-90">
                                                    {reward.id === 0 && <CircleOff className="w-5 h-5 md:w-6 md:h-6 text-white/40" />}
                                                    {reward.id === 1 && <Coins className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />}
                                                    {reward.id === 2 && <Star className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />}
                                                    {reward.id === 3 && <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Center Hub */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-slate-900 rounded-full border-[8px] border-slate-800 z-10 flex items-center justify-center shadow-2xl">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(129,140,248,1)]" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <button
                            onClick={handleSpin}
                            disabled={isSpinning}
                            className="mt-6 md:mt-8 group relative flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black text-base md:text-xl uppercase tracking-widest transition-all shadow-lg active:scale-95"
                        >
                            {isSpinning ? (
                                <RefreshCw className="w-6 h-6 animate-spin" />
                            ) : (
                                `JOUER (${SPIN_COST} 🪙)`
                            )}
                        </button>
                    </div>

                    {/* Result Section */}
                    <div className="flex flex-col items-center justify-center min-h-[350px]">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center text-center p-4 md:p-6 bg-slate-900/40 border border-white/5 rounded-[24px] backdrop-blur-md w-full max-w-sm shadow-2xl"
                                >
                                    <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-3">RÉSULTAT</h2>
                                    <div className="text-2xl md:text-3xl font-black mb-4" style={{ color: result.id === 0 ? '#64748b' : result.color }}>
                                        {result.label}
                                    </div>

                                    {wonCard && (
                                        <div className="mb-4 scale-80 md:scale-90"><Card card={wonCard} /></div>
                                    )}

                                    {result.type === 'coins' && Number(result.value) > 0 && (
                                        <div className="text-xl font-black text-amber-500">+{result.value} 🪙</div>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="text-center opacity-10">
                                    <Dices className="w-16 h-16 mx-auto mb-4" />
                                    <p className="font-serif italic text-lg">Le sort en est jeté...</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Simplified Legend */}
                <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border border-slate-500/20 bg-slate-500/10 text-slate-500">
                            <CircleOff className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-black text-[10px] uppercase truncate">PERDU (45%)</div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                            <Coins className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-black text-[10px] uppercase truncate">PIÈCES (30%)</div>
                            <div className="text-[8px] text-slate-500 font-bold uppercase">50 (60%) • 100 (30%) • 200 (10%)</div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border border-pink-500/20 bg-pink-500/10 text-pink-400">
                            <Star className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-black text-[10px] uppercase truncate">CARTES (20%)</div>
                            <div className="text-[8px] text-slate-500 font-bold uppercase">ÉPIQUE (80%) • LÉGENDE (20%)</div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border border-amber-500/20 bg-amber-500/10 text-amber-500">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-black text-[10px] uppercase truncate">JACKPOT (5%)</div>
                            <div className="text-[8px] text-slate-500 font-bold uppercase">1000 PIÈCES FIXE</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
