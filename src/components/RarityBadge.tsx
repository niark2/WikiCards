import { Rarity } from "@/types";
import { Star, Shield, Gem, Crown, Sparkles } from "lucide-react";

interface RarityBadgeProps {
    rarity: Rarity;
    className?: string;
}

const config = {
    Common: {
        label: "Common",
        icon: Shield,
        colors: "bg-slate-800 text-slate-300 border-slate-600",
    },
    Uncommon: {
        label: "Uncommon",
        icon: Star,
        colors: "bg-emerald-950 text-emerald-400 border-emerald-800",
    },
    Rare: {
        label: "Rare",
        icon: Gem,
        colors: "bg-blue-950 text-blue-400 border-blue-800",
    },
    Epic: {
        label: "Epic",
        icon: Crown,
        colors: "bg-fuchsia-950 text-fuchsia-400 border-fuchsia-800 shadow-[0_0_10px_rgba(192,38,211,0.2)]",
    },
    Legendary: {
        label: "Legendary",
        icon: Sparkles,
        colors: "bg-yellow-950 text-yellow-500 border-yellow-600 shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse",
    },
};

export function RarityBadge({ rarity, className = "" }: RarityBadgeProps) {
    const { label, icon: Icon, colors } = config[rarity] || config.Common;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors} ${className}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">{label}</span>
        </div>
    );
}
