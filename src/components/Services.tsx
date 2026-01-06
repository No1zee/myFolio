"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './Badge';
import {
    ShieldCheckIcon,
    BoltIcon,
    ArrowPathIcon,
    ServerStackIcon,
    CodeBracketIcon,
    CpuChipIcon,
    CloudIcon,
    LockClosedIcon,
    CommandLineIcon,
    TableCellsIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';

const ICON_MAP: Record<string, React.ReactNode> = {
    "ShieldCheckIcon": <ShieldCheckIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "BoltIcon": <BoltIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "ArrowPathIcon": <ArrowPathIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "ServerStackIcon": <ServerStackIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "CodeBracketIcon": <CodeBracketIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "CpuChipIcon": <CpuChipIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "CloudIcon": <CloudIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "LockClosedIcon": <LockClosedIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "CommandLineIcon": <CommandLineIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "DynamicsNavIcon": <TableCellsIcon className="w-6 h-6 text-brand-primary stroke-2" />,
    "Microsoft365Icon": <Squares2X2Icon className="w-6 h-6 text-brand-primary stroke-2" />,
};

const services = [
    {
        title: "Network Security Audit",
        icon: "🛡️",
        description: "Comprehensive vulnerability assessment of your network infrastructure. Includes penetration testing summaries and actionable hardening strategies.",
        features: ["Vulnerability Scan", "Firewall Config", "Access Control Review"],
        color: "from-blue-500 to-cyan-400"
    },
    {
        title: "System Optimization",
        icon: "🚀",
        description: "Hardware and software analysis to identify bottlenecks. We tune your systems for peak performance and minimal downtime.",
        features: ["Performance Tuning", "Hardware Upgrades", "Software Patching"],
        color: "from-mint-500 to-green-400"
    },
    {
        title: "Disaster Recovery",
        icon: "💾",
        description: "Don't lose data to the unexpected. I design robust backup and recovery plans ensuring business continuity in any crisis.",
        features: ["Backup Strategy", "Incident Response", "Recovery Drills"],
        color: "from-pink-500 to-purple-400"
    },
    {
        title: "IT Infrastructure Design",
        icon: "🏗️",
        description: "Building from scratch or upgrading? I design scalable, secure, and efficient IT architectures tailored to your business goals.",
        features: ["Network Topology", "Server Setup", "Cloud Integration"],
        color: "from-yellow-400 to-orange-400"
    }
];


type ServiceData = {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    features: string; // JSON string
    order: number;
}

const Services = ({ services }: { services: ServiceData[] }) => {
    return (
        <section id="services" className="py-32 px-6 relative overflow-hidden backdrop-blur-sm">
            {/* Background Gradients to Replace Opaque Color */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/5 to-transparent pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-sm font-bold tracking-[0.2em] text-brand-primary uppercase mb-6 border-b-2 border-brand-primary/30 pb-2"
                    >
                        CHAPTER I: WHAT I DO
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-brand-surface-alt mb-4"
                    >
                        Capabilities
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto mb-6"
                    >
                        Specialized technical services designed to secure, optimize, and scale your operations.
                    </motion.p>

                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {services.map((service, index) => {
                        let features: string[] = [];
                        try {
                            features = JSON.parse(service.features);
                        } catch (e) { features = service.features.split(','); }

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="group relative p-8 rounded-3xl bg-gray-900/40 backdrop-blur-md border border-white/5 hover:border-brand-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10 overflow-hidden"
                            >
                                {/* Blended Background Animation */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 via-brand-primary/0 to-brand-primary/5 group-hover:from-brand-primary/10 group-hover:via-brand-primary/5 group-hover:to-brand-primary/0 transition-all duration-700 ease-in-out"></div>
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] group-hover:bg-brand-primary/20 transition-all duration-700"></div>

                                {/* Twinkling Stars Layer */}
                                <div className="absolute inset-0 z-0 pointer-events-none">
                                    {[
                                        { top: "15%", left: "10%", delay: 0 },
                                        { top: "75%", left: "85%", delay: 1.5 },
                                        { top: "20%", left: "90%", delay: 0.8 },
                                        { top: "80%", left: "15%", delay: 2.2 },
                                    ].map((star, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-0.5 h-0.5 bg-white rounded-full component-star"
                                            style={{ top: star.top, left: star.left }}
                                            animate={{
                                                opacity: [0.2, 0.8, 0.2],
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{
                                                duration: 3 + i, // Slight variance
                                                repeat: Infinity,
                                                delay: star.delay,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                {/* Network Decoration Node (Top Right) */}
                                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-brand-primary/20 flex items-center justify-center animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-brand-surface-alt flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-gray-800">
                                        {ICON_MAP[service.icon] || <span className="text-2xl">{service.icon}</span>}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-brand-heading group-hover:text-brand-primary transition-colors">{service.title}</h3>
                                    <p className="text-brand-body-dark text-sm leading-relaxed mb-6">{service.description}</p>

                                    {/* Features list if parsed */}
                                    {features.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {features.map((feature, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <div className="mt-16 text-center">
                    <a href="#projects" className="inline-flex flex-col items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors group">
                        <span className="uppercase tracking-widest text-[10px]">See how this looks in practice</span>
                        <span className="group-hover:translate-y-1 transition-transform">↓</span>
                    </a>
                </div>
            </div>
        </section>
    );
};


export default Services;
