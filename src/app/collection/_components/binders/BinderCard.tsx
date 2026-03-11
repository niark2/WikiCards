"use client";

import { Binder, BinderProgress } from "@/lib/binders/types";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

interface BinderCardProps {
    binder: Binder;
    progress: BinderProgress;
    isClaimed: boolean;
    onViewDetails: (binder: Binder) => void;
    onClaimReward: (binder: Binder) => void;
}

export function BinderCard({ binder, progress, isClaimed, onViewDetails, onClaimReward }: BinderCardProps) {
    const Icon = (Icons as any)[binder.icon] || Icons.Book;
    const percentage = Math.min(100, (progress.currentCount / binder.targetCount) * 100);
    const isCompleted = progress.isCompleted;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group hover:border-indigo-500/50 transition-colors h-full flex flex-col"
        >
            <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{binder.title}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">
                    {binder.description}
                </p>

                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">Progress</span>
                        <span className={isCompleted ? 'text-indigo-400' : 'text-slate-300'}>
                            {progress.currentCount} / {binder.targetCount}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className={`h-full ${isCompleted ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-600'}`}
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-900/60 border-t border-white/5 flex gap-2">
                <button
                    onClick={() => onViewDetails(binder)}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-white/5"
                >
                    View Album
                </button>
                
                {isCompleted && !isClaimed ? (
                    <button
                        onClick={() => onClaimReward(binder)}
                        className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 animate-pulse"
                    >
                        Claim {binder.reward} WC
                    </button>
                ) : isClaimed ? (
                    <div className="flex-1 py-2 px-3 bg-slate-800/50 text-slate-500 text-sm font-medium rounded-lg text-center flex items-center justify-center gap-1 opacity-60">
                        <Icons.CheckCircle2 className="w-4 h-4" /> Claimed
                    </div>
                ) : (
                    <div className="flex-1 py-2 px-3 bg-slate-900/20 text-slate-600 text-sm font-medium rounded-lg text-center cursor-default">
                        {binder.reward} WC
                    </div>
                )}
            </div>
        </motion.div>
    );
}
