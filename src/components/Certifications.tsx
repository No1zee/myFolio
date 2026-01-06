"use client";

import React from 'react';
import { motion } from 'framer-motion';






type CertData = {
    id: string;
    name: string;
    issuer: string;
    year: string;
    color: string;
    category: string;
    tech: string | null;
}

import {
    ShieldCheckIcon,
    CloudIcon,
    CpuChipIcon,
    ClipboardDocumentCheckIcon,
    AcademicCapIcon,
    BeakerIcon
} from '@heroicons/react/24/outline';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Cybersecurity": <ShieldCheckIcon className="w-8 h-8" />,
    "Cloud": <CloudIcon className="w-8 h-8" />,
    "Emerging Tech": <CpuChipIcon className="w-8 h-8" />,
    "Compliance": <ClipboardDocumentCheckIcon className="w-8 h-8" />,
    "Core": <AcademicCapIcon className="w-8 h-8" />,
    "Experimental": <BeakerIcon className="w-8 h-8" />
};

const Certifications = ({ certs }: { certs: CertData[] }) => {
    // Separate Core and Experimental
    const coreCerts = certs.filter(c => c.category !== 'Experimental');
    const labCerts = certs.filter(c => c.category === 'Experimental');

    // Helper to get icon
    const getIcon = (cert: CertData) => {
        // Try mapping by specific category first, then fallback to general
        if (cert.tech?.includes("Security") || cert.name.includes("Cyber")) return CATEGORY_ICONS["Cybersecurity"];
        if (cert.tech?.includes("Cloud") || cert.name.includes("Cloud") || cert.name.includes("Azure")) return CATEGORY_ICONS["Cloud"];
        if (cert.tech?.includes("Compliance") || cert.name.includes("ISO")) return CATEGORY_ICONS["Compliance"];
        if (cert.category === "Experimental") return CATEGORY_ICONS["Experimental"];
        return CATEGORY_ICONS["Core"];
    };

    return (
        <section id="certifications" className="py-32 px-6 relative z-10 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold mb-4 text-brand-surface-alt"
                    >
                        Verified Expertise
                    </motion.h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Professional validations of my technical competencies and industry standards alignment.
                    </p>
                </div>

                {/* CORE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {coreCerts.map((cert) => {
                        let tech: string[] = [];
                        try { tech = JSON.parse(cert.tech || "[]"); } catch { tech = []; }

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                key={cert.id || cert.name}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-primary/20 transition-all group flex gap-4 items-start"
                            >
                                <div className={`shrink-0 w-12 h-12 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300`}>
                                    {getIcon(cert)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{cert.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{cert.issuer} • {cert.year}</p>

                                    <div className="flex flex-wrap gap-1">
                                        {tech.slice(0, 2).map(t => (
                                            <span key={t} className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* LABS / EXPERIMENTAL */}
                {labCerts.length > 0 && (
                    <div className="border-t border-gray-200 pt-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                <BeakerIcon className="w-4 h-4" />
                                Labs & Experiments
                            </h3>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {labCerts.map((cert) => (
                                <div key={cert.id || cert.name} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                        {getIcon(cert)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700 text-sm">{cert.name}</h4>
                                        <p className="text-xs text-gray-500">{cert.issuer} • {cert.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};


export default Certifications;
