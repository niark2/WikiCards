"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end w-full max-w-xs sm:max-w-sm px-4 md:px-0">
                <AnimatePresence mode="popLayout" initial={false}>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, x: 20, transition: { duration: 0.2 } }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                                mass: 0.8
                            }}
                            layout
                            className="w-full flex justify-end"
                        >
                            <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        error: <AlertCircle className="w-5 h-5 text-rose-400" />,
        info: <Info className="w-5 h-5 text-sky-400" />,
    };

    const bgColors = {
        success: 'bg-emerald-950 border-emerald-500/50 shadow-emerald-500/20',
        error: 'bg-rose-950 border-rose-500/50 shadow-rose-500/20',
        info: 'bg-slate-900 border-slate-700 shadow-xl',
    };

    return (
        <div className={`
      flex items-center gap-4 px-4 py-3.5 rounded-2xl border shadow-2xl
      w-full ${bgColors[toast.type]}
      relative overflow-hidden group pointer-events-auto
    `}>
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

            <div className="shrink-0 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">{icons[toast.type]}</div>
            <p className="text-sm font-semibold text-white/90 mr-2 drop-shadow-sm">{toast.message}</p>

            <button
                onClick={onRemove}
                className="ml-auto text-white/30 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Progress bar timer (visual only) */}
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-[2px] w-full origin-left ${toast.type === 'success' ? 'bg-emerald-500/50' :
                    toast.type === 'error' ? 'bg-rose-500/50' : 'bg-sky-500/50'
                    }`}
            />
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
