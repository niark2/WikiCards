"use client";

import { useState, useEffect, useCallback } from "react";

// Helper to get or create a global AudioContext
let globalAudioCtx: AudioContext | null = null;
function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!globalAudioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        globalAudioCtx = new AudioContextClass();
    }
    return globalAudioCtx;
}

export function useSound() {
    const [isMuted, setIsMuted] = useState<boolean>(false);

    useEffect(() => {
        const stored = localStorage.getItem("wiki-sound-muted");
        if (stored === "true") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsMuted(true);
        }
    }, [setIsMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => {
            const newVal = !prev;
            localStorage.setItem("wiki-sound-muted", String(newVal));
            return newVal;
        });
    }, []);

    // Helper to abstract osc creation
    const playTone = useCallback(
        (freq: number, type: OscillatorType, dur: number, vol: number = 0.1) => {
            if (isMuted) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            if (ctx.state === "suspended") ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0, ctx.currentTime);
            // Quick attack
            gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.05);
            // Exponential release
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + dur);
        },
        [isMuted]
    );

    const playCoinSound = useCallback(() => {
        if (isMuted) return;
        // Two high synth pings
        playTone(1200, "sine", 0.3, 0.1);
        setTimeout(() => playTone(1600, "sine", 0.4, 0.1), 100);
    }, [isMuted, playTone]);

    const playBoosterOpenSound = useCallback(() => {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === "suspended") ctx.resume();

        // Magical pop/chime effect
        // 1. Initial pop
        const popOsc = ctx.createOscillator();
        const popGain = ctx.createGain();
        popOsc.type = "sine";
        popOsc.frequency.setValueAtTime(800, ctx.currentTime);
        popOsc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

        popGain.gain.setValueAtTime(0, ctx.currentTime);
        popGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
        popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        popOsc.connect(popGain);
        popGain.connect(ctx.destination);
        popOsc.start(ctx.currentTime);
        popOsc.stop(ctx.currentTime + 0.2);

        // 2. Trailing magical chime (arpeggio)
        const notes = [659.25, 880, 1108.73, 1318.51, 1760]; // E5, A5, C#6, E6, A6 (A major)
        notes.forEach((freq, idx) => {
            const timeOffset = idx * 0.08;
            const chimeOsc = ctx.createOscillator();
            const chimeGain = ctx.createGain();
            chimeOsc.type = "sine";
            // slight pitch slide for maximum magic
            chimeOsc.frequency.setValueAtTime(freq - 20, ctx.currentTime + timeOffset);
            chimeOsc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + timeOffset + 0.05);

            chimeGain.gain.setValueAtTime(0, ctx.currentTime + timeOffset);
            chimeGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + timeOffset + 0.05);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.4);

            chimeOsc.connect(chimeGain);
            chimeGain.connect(ctx.destination);
            chimeOsc.start(ctx.currentTime + timeOffset);
            chimeOsc.stop(ctx.currentTime + timeOffset + 0.5);
        });
    }, [isMuted]);

    const playForgeSound = useCallback(() => {
        if (isMuted) return;
        // Metallic clank (multiple discordant frequencies)
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === "suspended") ctx.resume();

        playTone(300, "square", 0.4, 0.1);
        playTone(450, "square", 0.4, 0.1);
        playTone(600, "sawtooth", 0.6, 0.05);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1800, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);

    }, [isMuted, playTone]);

    const playRevealSound = useCallback((rarity: string) => {
        if (isMuted) return;
        if (rarity === "Legendary") {
            playTone(440, "sine", 0.5, 0.1);
            setTimeout(() => playTone(554, "sine", 0.5, 0.1), 100);
            setTimeout(() => playTone(659, "sine", 0.5, 0.1), 200);
            setTimeout(() => playTone(880, "sine", 1.0, 0.2), 300);
        } else if (rarity === "Epic") {
            playTone(440, "sine", 0.4, 0.1);
            setTimeout(() => playTone(659, "sine", 0.6, 0.15), 150);
        } else if (rarity === "Rare") {
            playTone(500, "sine", 0.4, 0.1);
        } else {
            playTone(400, "triangle", 0.3, 0.05);
        }
    }, [isMuted, playTone]);

    const playDrawSound = useCallback(() => {
        if (isMuted) return;
        // Quick "pop" or "whoosh" for drawing/hovering a card
        playTone(600, "triangle", 0.1, 0.02);
    }, [isMuted, playTone]);

    return {
        isMuted,
        toggleMute,
        playCoinSound,
        playBoosterOpenSound,
        playForgeSound,
        playRevealSound,
        playDrawSound
    };
}
