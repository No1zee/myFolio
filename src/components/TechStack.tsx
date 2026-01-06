"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    CpuChipIcon,
    CloudIcon,
    CodeBracketIcon,
    CircleStackIcon,
    CommandLineIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const TechItem = ({ name, description, icon: Icon, delay }: { name: string, description: string, icon: any, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="group relative bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-brand-primary/50 transition-colors overflow-hidden"
    >
        <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-colors text-gray-400">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-white font-bold mb-1 group-hover:text-brand-primary transition-colors">{name}</h3>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
        </div>
        {/* Tech Decor elements */}
        <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-brand-primary" />
            <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-brand-primary delay-75" />
            <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-brand-primary delay-150" />
        </div>
    </motion.div>
);

const TechStack = () => {
    const technologies = [
        {
            category: "Core Intelligence",
            items: [
                { name: "Google Gemini 2.5 Flash", description: "Advanced multimodal reasoning & content generation.", icon: SparklesIcon },
                { name: "Vercel AI SDK", description: "Streamlined AI integration & streaming responses.", icon: CpuChipIcon },
            ]
        },
        {
            category: "Frontend Architecture",
            items: [
                { name: "Next.js 14", description: "App Router, Server Components & Edge Runtime.", icon: CodeBracketIcon },
                { name: "React 18", description: "Concurrent rendering & state management.", icon: CodeBracketIcon },
                { name: "TailwindCSS", description: "Utility-first rapid styling engine.", icon: CommandLineIcon },
                { name: "Framer Motion", description: "Production-ready declarative animations.", icon: SparklesIcon },
            ]
        },
        {
            category: "Infrastructure & Data",
            items: [
                { name: "Vercel Edge", description: "Global content delivery & edge functions.", icon: CloudIcon },
                { name: "PostgreSQL", description: "Relational data persistence via Prisma ORM.", icon: CircleStackIcon },
            ]
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-black/40">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <CpuChipIcon className="w-4 h-4" />
                        System Architecture
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Powered by <span className="text-brand-primary">Next-Gen Tech</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Built on a foundation of modern web technologies, AI integration, and robust infrastructure.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {technologies.map((techGroup, groupIndex) => (
                        <div key={groupIndex} className="space-y-6">
                            <h3 className="text-gray-500 font-mono text-sm uppercase tracking-widest border-b border-gray-800 pb-2 mb-6">
                                {techGroup.category}
                            </h3>
                            <div className="space-y-4">
                                {techGroup.items.map((tech, i) => (
                                    <TechItem
                                        key={i}
                                        {...tech}
                                        delay={0.1 * i + (groupIndex * 0.2)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStack;
