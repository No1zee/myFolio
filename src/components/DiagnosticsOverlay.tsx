"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionStore } from '@/lib/store';

const DiagnosticsOverlay = () => {
    const { diagnosticsMode, toggleDiagnostics, setDiagnostics } = useMissionStore();
    const [fps, setFps] = useState(0);
    const [memory, setMemory] = useState(0);

    // Scroll Listener to Dismiss
    useEffect(() => {
        if (!diagnosticsMode) return;

        const handleScroll = () => {
            setDiagnostics(false);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [diagnosticsMode, setDiagnostics]);

    // Konami Code Listener
    useEffect(() => {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let cursor = 0;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === konamiCode[cursor]) {
                cursor++;
                if (cursor === konamiCode.length) {
                    toggleDiagnostics();
                    cursor = 0;
                }
            } else {
                cursor = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleDiagnostics]);

    // Simulated Metrics
    useEffect(() => {
        if (!diagnosticsMode) return;
        const interval = setInterval(() => {
            setFps(Math.floor(58 + Math.random() * 4));
            setMemory(Math.floor(40 + Math.random() * 20)); // Simulated heap
        }, 1000);
        return () => clearInterval(interval);
    }, [diagnosticsMode]);

    return (
        <AnimatePresence>
            {diagnosticsMode && (
                <div className="fixed inset-0 z-[100] pointer-events-none font-mono text-xs text-green-500 overflow-hidden">
                    {/* Grid Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[url('/grid.svg')]"
                    ></motion.div>
                    <div className="absolute inset-0 bg-green-900/5 mix-blend-overlay"></div>

                    {/* Top Left Metrics */}
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="absolute top-4 left-4 space-y-1 bg-black/80 p-4 rounded border border-green-500/30 backdrop-blur-sm"
                    >
                        <h3 className="text-green-400 font-bold mb-2 border-b border-green-500/30 pb-1">
                            <Typewriter text="SYS_DIAGNOSTICS_V4" />
                        </h3>
                        <div className="flex justify-between w-48"><span>FRAME_RATE:</span> <span>{fps} FPS</span></div>
                        <div className="flex justify-between w-48"><span>HEAP_ALLOC:</span> <span>{memory} MB</span></div>
                        <div className="flex justify-between w-48"><span>RENDER_ENGINE:</span> <span>REACT_TURBOPACK</span></div>
                        <div className="flex justify-between w-48"><span>SESSION_ID:</span> <span>{Math.random().toString(36).substring(7).toUpperCase()}</span></div>
                    </motion.div>

                    {/* Top Right Specs - Staggered & Typed */}
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: "circOut" }}
                        className="absolute top-4 right-4 text-right space-y-1 bg-black/80 p-4 rounded border border-green-500/30 backdrop-blur-sm"
                    >
                        <h3 className="text-green-400 font-bold mb-2 border-b border-green-500/30 pb-1">
                            <Typewriter text="TECH_STACK_MANIFEST" delay={400} />
                        </h3>
                        {/* We use specific delays for each line to create the "terminal log" feel */}
                        <div className="flex justify-end gap-4"><span className="opacity-50">CORE_FRAMEWORK</span> <span className="text-white"><Typewriter text="Next.js 15 (App Router)" delay={800} /></span></div>
                        <div className="flex justify-end gap-4"><span className="opacity-50">RUNTIME_ENV</span> <span className="text-white"><Typewriter text="React 19 / TypeScript" delay={1200} /></span></div>
                        <div className="flex justify-end gap-4"><span className="opacity-50">STYLING_SYS</span> <span className="text-white"><Typewriter text="Tailwind CSS + Framer Motion" delay={1600} /></span></div>
                        <div className="flex justify-end gap-4"><span className="opacity-50">DATA_LAYER</span> <span className="text-white"><Typewriter text="Prisma ORM / Postgres" delay={2000} /></span></div>
                        <div className="flex justify-end gap-4"><span className="opacity-50">INFRASTRUCTURE</span> <span className="text-white"><Typewriter text="Vercel Edge Network" delay={2400} /></span></div>
                    </motion.div>

                    {/* Bottom Left Logs */}
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.6, ease: "circOut" }}
                        className="absolute bottom-4 left-4 w-64 h-32 bg-black/80 p-2 rounded border border-green-500/30 backdrop-blur-sm overflow-hidden flex flex-col-reverse shadow-lg"
                    >
                        <LogStream />
                    </motion.div>

                    {/* Center Notice */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="absolute top-12 left-1/2 -translate-x-1/2 bg-green-500/10 border border-green-500/50 px-6 py-2 rounded text-green-400"
                    >
                        ⚠️ DIAGNOSTICS MODE ACTIVE
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const Typewriter = ({ text, delay = 0, speed = 20 }: { text: string, delay?: number, speed?: number }) => {
    const [displayed, setDisplayed] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        let index = 0;
        const interval = setInterval(() => {
            if (index <= text.length) {
                setDisplayed(text.slice(0, index));
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [started, text, speed]);

    return <span>{displayed}{started && displayed.length < text.length && <span className="animate-pulse">_</span>}</span>;
};

const LogStream = () => {
    return (
        <div className="opacity-70 text-[10px] leading-tight space-y-1">
            <LogLine text="> [SYSTEM] Handshake established" delay={100} />
            <LogLine text="> [NET] Packet loss: 0.00%" delay={400} />
            <LogLine text="> [GRAPHICS] WebGL Context: Active" delay={700} />
            <LogLine text="> [SECURE] Connection encrypted" delay={1000} />
            <LogLine text="> [KERNEL] Awakening modules..." delay={1400} />
        </div>
    );
};

const LogLine = ({ text, delay }: { text: string, delay: number }) => {
    return (
        <div className="h-3">
            <Typewriter text={text} delay={delay} speed={10} />
        </div>
    )
}

export default DiagnosticsOverlay;
