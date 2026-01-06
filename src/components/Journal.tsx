"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MegaphoneIcon, CpuChipIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import StarCard from './StarCard';
import { useMissionStore } from '@/lib/store';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Updates": <MegaphoneIcon className="w-4 h-4" />,
    "Tech": <CpuChipIcon className="w-4 h-4" />,
    "Insights": <LightBulbIcon className="w-4 h-4" />
};

// --- DATA ---


const CATEGORIES = ["All", "Updates", "Tech", "Insights"];


type JournalData = {
    id: string;
    stardate: string;
    title: string;
    category: string;
    content: string;
    imageUrl?: string | null;
    tags: string; // JSON
}

const Journal = ({ logs }: { logs: JournalData[] }) => {
    const { completeTask } = useMissionStore();
    const [filter, setFilter] = useState("All");

    const filteredLogs = filter === "All"
        ? logs
        : logs.filter(log => log.category === filter);

    return (

        <section id="journal" className="py-32 px-6 relative z-10 bg-brand-surface border-t border-gray-800">
            <div className="max-w-[1200px] mx-auto">
                {/* HEADER */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block text-sm font-bold tracking-[0.2em] text-brand-primary uppercase mb-6 border-b-2 border-brand-primary/30 pb-2"
                    >
                        CHAPTER IV: CURRENT MISSION
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                    >
                        Captain&apos;s Log
                    </motion.h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Personal updates, technical deep-dives, and observations from the field.
                    </p>
                </div>

                {/* FILTERS */}
                <div className="flex justify-center gap-2 mb-12 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-mono transition-all flex items-center gap-2 ${filter === cat
                                ? "bg-brand-primary text-white shadow-lg shadow-blue-500/20"
                                : "bg-brand-surface-alt text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            {CATEGORY_ICONS[cat]}
                            [{cat.toUpperCase()}]
                        </button>
                    ))}
                </div>

                {/* LOG GRID */}
                <div className="grid gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredLogs.map((log, index) => {
                            let tags: string[] = [];
                            try { tags = JSON.parse(log.tags); } catch { tags = []; }
                            return (
                                <StarCard
                                    key={log.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="cursor-pointer"
                                >
                                    <div className="p-0 h-full flex flex-col relative">
                                        {/* Image Header */}
                                        {log.imageUrl && (
                                            <div className="w-full h-40 bg-gray-900 overflow-hidden relative">
                                                <img src={log.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            </div>
                                        )}

                                        <div className="p-6 flex-1 flex flex-col">
                                            {/* Reading Progress Buffer (Simulated) */}
                                            <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-brand-primary to-blue-400 w-0 group-hover:w-full transition-all duration-[2s] ease-linear z-20"></div>

                                            {/* Category Accent Line */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${log.category === 'Updates' ? 'bg-brand-success' : 'bg-brand-primary'} opacity-50 group-hover:opacity-100 transition-opacity`}></div>

                                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                                                <span className="text-xs font-mono text-gray-500">
                                                    {new Date(log.stardate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                                                        {log.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-300 group-hover:text-brand-primary transition-colors mb-3">
                                                {log.title}
                                            </h3>

                                            {/* Hover Excerpt */}
                                            <div
                                                onClick={() => completeTask('readLog')}
                                                className="text-sm text-gray-500 line-clamp-3 group-hover:text-gray-300 transition-colors"
                                            >
                                                {log.content.substring(0, 120)}...
                                            </div>
                                        </div>
                                    </div>
                                </StarCard>
                            );
                        })}
                    </AnimatePresence>
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="/blog"
                        onClick={() => completeTask('readLog')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-brand-primary pb-1"
                    >
                        Read All Entries <span className="text-brand-primary">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};


export default Journal;
