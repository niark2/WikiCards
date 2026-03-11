"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Coins, Home, GalleryVertical, Hammer, BookOpen, ShoppingBag, Dices, ChevronDown, Compass, Menu, X } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/useToast";
import { Volume2, VolumeX } from "lucide-react";
import { canClaimDailyCoinReward, claimDailyCoinReward, logActivity } from "@/lib/storage";

export function Navbar() {
    const { coins, addCoins } = useCoins();
    const { showToast } = useToast();
    const { isMuted, toggleMute } = useSound();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);

        // Daily Coin Reward
        if (canClaimDailyCoinReward()) {
            const REWARD_AMOUNT = 50;
            addCoins(REWARD_AMOUNT);
            claimDailyCoinReward();
            logActivity('coins_added', `Daily Reward: +${REWARD_AMOUNT} WikiCoins`, REWARD_AMOUNT);
            
            // Wait a bit for the UI to be ready
            setTimeout(() => {
                showToast(`Welcome back! +${REWARD_AMOUNT} WikiCoins added.`, 'success');
            }, 1000);
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);


    return (
        <>
            <motion.nav 
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : -80 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 w-full z-[100] bg-slate-900/80 backdrop-blur-xl border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-600/20 transition-all duration-300">
                            <Layers className="text-indigo-500 group-hover:scale-110 transition-transform w-6 h-6" />
                        </div>
                        <span className="font-serif font-bold text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                            WikiCards
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
                        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                            <Home className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            <span>Home</span>
                        </Link>
                        <Link href="/booster" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                            <GalleryVertical className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                            <span>Boosters</span>
                        </Link>

                        <Link href="/collection" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                            <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            <span>Collection</span>
                        </Link>

                        {/* Dropdown Menu */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
                                <Compass className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                <span>ACTIVITIES</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                                    >
                                        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 w-48 shadow-2xl">
                                            <Link href="/market" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                                                <ShoppingBag className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                                                <span>Market</span>
                                            </Link>
                                            <Link href="/craft" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                                                <Hammer className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                                <span>Forge</span>
                                            </Link>
                                            <Link href="/gambling" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                                                <Dices className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                                                <span>Wheel</span>
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-4 ml-2">
                            <button
                                onClick={toggleMute}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                title={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black shadow-[inset_0_0_10px_rgba(245,158,11,0.05)]">
                                <Coins className="w-4 h-4" />
                                {coins}
                            </div>
                        </div>
                    </div>

                    {/* Mobile: Coins + Hamburger */}
                    <div className="flex md:hidden items-center gap-3">
                        <button
                            onClick={toggleMute}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black text-xs">
                            <Coins className="w-3.5 h-3.5" />
                            {coins}
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-all"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Drawer — Portaled to body to avoid nav clipping */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ position: 'fixed', inset: 0, top: 64, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            {/* Drawer */}
                            <motion.div
                                key="drawer"
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                style={{ position: 'fixed', top: 64, right: 0, bottom: 0, width: 300, zIndex: 201, overflowY: 'auto' }}
                                className="bg-slate-950 border-l border-white/5"
                            >
                                <div className="flex flex-col p-4 gap-1">
                                    <p className="text-[9px] font-black tracking-[0.4em] text-indigo-500 uppercase px-4 py-2 mb-1">Navigation</p>
                                    <MobileNavLink href="/" icon={<Home className="w-5.5 h-5.5" />} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
                                    <MobileNavLink href="/booster" icon={<GalleryVertical className="w-5.5 h-5.5" />} label="Boosters" onClick={() => setIsMobileMenuOpen(false)} />
                                    <MobileNavLink href="/collection" icon={<BookOpen className="w-5.5 h-5.5" />} label="Collection" onClick={() => setIsMobileMenuOpen(false)} />

                                    <div className="h-px bg-white/5 my-3" />
                                    <p className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase px-4 py-2 mb-1">Activities</p>
                                    <MobileNavLink href="/market" icon={<ShoppingBag className="w-5.5 h-5.5" />} label="Market" onClick={() => setIsMobileMenuOpen(false)} />
                                    <MobileNavLink href="/craft" icon={<Hammer className="w-5.5 h-5.5" />} label="Forge" onClick={() => setIsMobileMenuOpen(false)} />
                                    <MobileNavLink href="/gambling" icon={<Dices className="w-5.5 h-5.5" />} label="Wheel" onClick={() => setIsMobileMenuOpen(false)} />
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

function MobileNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-4.5 px-5 py-4 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-[15px] font-bold"
        >
            <span className="text-slate-500">{icon}</span>
            {label}
        </Link>
    );
}
