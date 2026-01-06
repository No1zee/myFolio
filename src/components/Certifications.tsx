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
    order: number;
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
    // Flagships are top ordered (1-4)
    const flagships = certs.filter(c => (c.order > 0 && c.order <= 4));

    // Group others by category
    const others = certs.filter(c => c.order > 4 || c.order === 0);
    const groups = {
        "Security & Compliance": others.filter(c => c.category === 'Security'),
        "Cloud Infrastructure": others.filter(c => c.category === 'Cloud' || c.category === 'Infrastructure'),
        "Experimental": others.filter(c => c.category === 'Experimental')
    };

    const getIcon = (cert: CertData) => {
        if (cert.category === "Security") return CATEGORY_ICONS["Cybersecurity"];
        if (cert.category === "Cloud") return CATEGORY_ICONS["Cloud"];
        if (cert.category === "Infrastructure") return CATEGORY_ICONS["Core"];
        if (cert.category === "Experimental") return CATEGORY_ICONS["Experimental"];
        return CATEGORY_ICONS["Core"];
    };

    return (
        <section id="certifications" className="py-24 px-6 relative z-10 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-brand-surface-alt"
                    >
                        Verified Expertise
                    </motion.h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Professional validations of my technical competencies and industry standards alignment.
                    </p>
                </div>

                {/* FLAGSHIP GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {flagships.map((cert) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl p-6 shadow-md border-t-4 border-brand-primary"
                        >
                            <div className="mb-4 text-brand-primary">{getIcon(cert)}</div>
                            <h3 className="font-bold text-gray-900 leading-tight mb-1 h-12 flex items-center">{cert.name}</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">{cert.issuer}</p>
                        </motion.div>
                    ))}
                </div>

                {/* GROUPED LISTS */}
                <div className="grid md:grid-cols-3 gap-12 border-t border-gray-200 pt-12">
                    {Object.entries(groups).map(([groupName, groupCerts]) => (
                        <div key={groupName}>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                {groupName === "Security & Compliance" && <ShieldCheckIcon className="w-5 h-5" />}
                                {groupName === "Cloud Infrastructure" && <CloudIcon className="w-5 h-5" />}
                                {groupName === "Experimental" && <BeakerIcon className="w-5 h-5" />}
                                {groupName}
                            </h3>
                            <div className="space-y-4">
                                {groupCerts.map((cert) => (
                                    <div key={cert.id} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="mt-1 text-gray-300 group-hover:text-brand-primary transition-colors">
                                            {getIcon(cert)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-700 text-sm group-hover:text-brand-primary transition-colors">{cert.name}</h4>
                                            <p className="text-xs text-gray-500">{cert.issuer} • {cert.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default Certifications;
