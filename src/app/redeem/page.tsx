"use client";

import { useState } from "react";
import { Ticket, Coins, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { logActivity, saveCollection, getRedeemedCodes, markCodeAsRedeemed } from "@/lib/storage";
import { fetchWikiArticle, parseWikipediaIdentifier } from "@/lib/wiki";
import { REDEEM_CODES } from "@/lib/redeem-codes";
import { motion, AnimatePresence } from "framer-motion";

export default function RedeemPage() {
    const [code, setCode] = useState("");
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const { addCoins } = useCoins();

    const handleRedeem = async () => {
        if (!code) return;

        const normalizedCode = code.trim().toLowerCase();
        const reward = REDEEM_CODES[normalizedCode];

        if (reward) {
            const alreadyRedeemed = getRedeemedCodes();
            if (alreadyRedeemed.includes(normalizedCode)) {
                setStatus({ type: 'error', message: "This code has already been redeemed." });
                return;
            }

            setLoading(true);
            try {
                if (reward.type === 'coins') {
                    const amount = reward.value as number;
                    addCoins(amount);
                    logActivity('code_redeemed', `Code Redeemed: ${normalizedCode}`, amount);
                    markCodeAsRedeemed(normalizedCode);
                    setStatus({
                        type: 'success',
                        message: reward.successMessage || `SUCCESS! +${amount} WikiCoins added to your balance.`
                    });
                } else if (reward.type === 'card') {
                    const articleIdentifier = reward.value as string;
                    const title = parseWikipediaIdentifier(articleIdentifier);
                    const cardData = await fetchWikiArticle(title);

                    if (cardData) {
                        saveCollection([{ ...cardData, id: `${cardData.id}-${Date.now()}` }]);
                        logActivity('code_redeemed', `Code Redeemed: ${normalizedCode} (${cardData.title})`, 0);
                        markCodeAsRedeemed(normalizedCode);
                        setStatus({
                            type: 'success',
                            message: reward.successMessage || `SUCCESS! You received a special card: ${cardData.title}!`
                        });
                    } else {
                        setStatus({ type: 'error', message: "Failed to fetch reward card. Please try again later." });
                    }
                }
                setCode("");
            } catch (error) {
                setStatus({ type: 'error', message: "An error occurred during redemption." });
            } finally {
                setLoading(false);
            }
        } else {
            setStatus({ type: 'error', message: "Invalid or expired code." });
        }

        setTimeout(() => {
            if (status?.type === 'success') {
                setStatus(null);
            }
        }, 5000);
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden pt-32 pb-20 flex flex-col items-center">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-2xl w-full px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                        <Ticket className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Redeem Rewards
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Enter your special codes below to unlock WikiCoins and legendary bonuses.
                    </p>
                </motion.div>

                <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />

                    <div className="relative space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">
                                Reward Code
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        if (status) setStatus(null);
                                    }}
                                    placeholder="XXXX-XXXX-XXXX"
                                    className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-2xl px-6 py-5 text-xl font-mono text-white focus:outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all placeholder:text-slate-700 tracking-wider text-center"
                                    onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </div>

                        <button
                            onClick={handleRedeem}
                            disabled={!code || loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] group/btn"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Ticket className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                                    REDEEM CODE
                                </>
                            )}
                        </button>

                        <AnimatePresence mode="wait">
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`p-4 rounded-xl border flex items-center gap-3 font-bold ${status.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}
                                >
                                    {status.type === 'success' ? (
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                    )}
                                    <p>{status.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-900/30 border border-white/5 rounded-3xl flex items-start gap-4">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                            <Coins className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-200 text-sm mb-1 uppercase tracking-wider">WikiCoins</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Codes can grant instant coin boosts to expand your collection.</p>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-900/30 border border-white/5 rounded-3xl flex items-start gap-4">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                            <Ticket className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-200 text-sm mb-1 uppercase tracking-wider">Exclusives</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Unlock limited edition boosters and special event cards.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
