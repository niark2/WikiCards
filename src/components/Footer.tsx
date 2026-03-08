"use client";

import Link from "next/link";
import { Github, HelpCircle, MessageSquare } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full py-4 px-6 bg-slate-950/50 backdrop-blur-md border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold tracking-wider text-slate-400">
                        WikiCards <span className="text-[10px] font-normal opacity-50">© 2026</span>
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <Link
                        href="/faq"
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors duration-300"
                    >
                        <HelpCircle className="w-3 h-3" />
                        FAQ
                    </Link>
                    <Link
                        href="https://github.com"
                        target="_blank"
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors duration-300"
                    >
                        <Github className="w-3 h-3" />
                        GitHub
                    </Link>
                    <Link
                        href="/support"
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors duration-300"
                    >
                        <MessageSquare className="w-3 h-3" />
                        Support
                    </Link>
                </div>
            </div>
        </footer>
    );
}
