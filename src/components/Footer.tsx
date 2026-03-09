"use client";

import Link from "next/link";
import { Github, HelpCircle, Ticket } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full py-2 px-6 bg-slate-950/50 backdrop-blur-md border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-serif text-[11px] font-bold tracking-wider text-slate-500">
                        WikiCards <span className="text-[9px] font-normal opacity-40">© 2026</span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/faq"
                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-400 transition-colors duration-300"
                    >
                        <HelpCircle className="w-2.5 h-2.5" />
                        FAQ
                    </Link>
                    <Link
                        href="https://github.com"
                        target="_blank"
                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-400 transition-colors duration-300"
                    >
                        <Github className="w-2.5 h-2.5" />
                        GitHub
                    </Link>
                    <Link
                        href="/redeem"
                        className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-400 transition-colors duration-300"
                    >
                        <Ticket className="w-2.5 h-2.5" />
                        Redeem
                    </Link>
                </div>
            </div>
        </footer>
    );
}
