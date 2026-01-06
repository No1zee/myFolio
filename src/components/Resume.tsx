"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { getExperiences, getSkills, getCertifications } from '@/app/actions/portfolio';

// Types for UI mapping
interface UIExperience {
    role: string;
    company: string;
    period: string;
    color: string;
    dot: string;
    details: string[];
    tags?: string[];
}

interface UISkillCategory {
    category: string;
    items: string[];
}

interface UICertification {
    id: string;
    name: string;
    issuer: string;
    year: string;
    category: string;
    color: string;
    tech: string;
}

const Resume = () => {
    const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'education'>('experience');
    const [experience, setExperience] = useState<UIExperience[]>([]);
    const [skills, setSkills] = useState<UISkillCategory[]>([]);
    const [certifications, setCertifications] = useState<UICertification[]>([]);
    const [loading, setLoading] = useState(true);

    const colors = [
        { border: "border-blue-500", dot: "bg-blue-500" },
        { border: "border-blue-400", dot: "bg-blue-400" },
        { border: "border-cyan-500", dot: "bg-cyan-500" },
        { border: "border-sky-500", dot: "bg-sky-500" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Experience
                const expData = await getExperiences();
                const mappedExp = expData.map((exp, index) => {
                    const formatDate = (d: Date) => {
                        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    };

                    const start = formatDate(new Date(exp.startDate));
                    const end = exp.endDate ? formatDate(new Date(exp.endDate)) : 'Present';
                    const period = `${start} - ${end}`;
                    const colorScheme = colors[index % colors.length];
                    const lines = exp.description.split('\n').filter(line => line.trim().length > 0);
                    const tagLine = lines.find(line => line.trim().startsWith('Tags:'));
                    const bullets = lines.filter(line => !line.trim().startsWith('Tags:')).map(line => line.replace(/^- /, ''));
                    const tags = tagLine ? tagLine.replace('Tags:', '').split(',').map(t => t.trim()) : [];

                    return {
                        role: exp.role,
                        company: exp.company,
                        period: period,
                        color: colorScheme.border,
                        dot: colorScheme.dot,
                        details: bullets,
                        tags: tags // Added tags back for UI
                    };
                });
                setExperience(mappedExp);

                // Fetch Skills
                const skillData = await getSkills();
                setSkills(skillData);

                // Fetch Certifications
                const certData = await getCertifications();
                setCertifications(certData as unknown as UICertification[]);

                setLoading(false);
            } catch (error) {
                console.error("Failed to load portfolio data", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const education = [
        {
            degree: "BSc (Hons), Information Systems",
            school: "Women’s University in Africa",
            year: "2022"
        },
        {
            degree: "CISCO CyberOps Training",
            school: "Ingressive4Good",
            year: "2023"
        }
    ];


    return (
        <section id="resume" className="py-32 px-6 relative z-10 min-h-screen backdrop-blur-sm">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-10">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block text-sm font-bold tracking-[0.2em] text-brand-primary uppercase mb-6 border-b-2 border-brand-primary/20 pb-2"
                    >
                        CHAPTER III: THE BACKSTORY
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold mb-4 text-brand-surface-alt"
                    >
                        Professional Journey
                    </motion.h2>
                    <div className="flex justify-center gap-4 flex-wrap">
                        {(['experience', 'skills', 'education'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === tab
                                    ? 'bg-brand-primary text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20 text-gray-500"
                        >
                            Loading Portfolio Data...
                        </motion.div>
                    ) : (
                        <>
                            {activeTab === 'experience' && (
                                <motion.div
                                    key="experience"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-12"
                                >
                                    {experience.map((job, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                                            className={`relative pl-8 border-l-4 ${job.color} rounded-r-2xl overflow-hidden p-6 mb-8 group bg-brand-surface shadow-2xl`}
                                        >
                                            {/* MILKY WAY BACKGROUND */}
                                            <div className="absolute inset-0 z-0 bg-brand-surface">
                                                <motion.div
                                                    animate={{
                                                        backgroundPosition: ["0% 0%", "100% 100%"],
                                                        scale: [1, 1.1, 1]
                                                    }}
                                                    transition={{
                                                        duration: 60,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                        scale: { duration: 30, repeat: Infinity, ease: "easeInOut" }
                                                    }}
                                                    className="absolute inset-0 opacity-10 bg-[url('/milky_way_texture.png')] bg-cover mix-blend-overlay"
                                                    style={{ backgroundSize: "200% 200%" }}
                                                />
                                                {/* Gradient Overlay for Readability */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-brand-surface/90 via-brand-surface/70 to-transparent"></div>
                                            </div>

                                            {/* CONTENT (z-10) */}
                                            <div className="relative z-10">
                                                <div className={`absolute -left-[35px] top-6 w-6 h-6 ${job.dot} rounded-full border-4 border-brand-bg shadow-[0_0_15px_rgba(29,78,216,0.3)]`}></div>
                                                <span className={`text-sm font-bold tracking-wider text-gray-400`}>{job.period}</span>
                                                <h3 className="text-2xl font-bold mt-1 text-brand-heading group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-primary group-hover:to-blue-400 transition-all">{job.role}</h3>
                                                <h4 className="text-lg text-gray-300 mb-4 font-medium">{job.company}</h4>
                                                <ul className="list-disc list-outside ml-4 text-brand-body-dark leading-relaxed space-y-2 mb-4">
                                                    {job.details.map((point, i) => (
                                                        <li key={i}>{point}</li>
                                                    ))}
                                                </ul>
                                                {job.tags && job.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-4 ml-1">
                                                        {job.tags.map(t => (
                                                            <span key={t} className="text-xs bg-brand-surface-alt text-brand-primary px-2 py-1 rounded border border-gray-700 font-mono">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'skills' && (
                                <motion.div
                                    key="skills"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                >
                                    <div className="space-y-8">
                                        {skills.map((category, index) => (
                                            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                                <h3 className="font-bold text-xl mb-4 text-brand-body-light">{category.category}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {category.items.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1 bg-brand-light text-brand-body-light text-sm rounded-full font-medium border border-gray-200 hover:border-brand-primary/30 transition-colors">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-brand-surface p-8 rounded-3xl text-white border border-gray-800 shadow-2xl">
                                        <h3 className="font-bold text-2xl mb-6 text-brand-heading">Verified Expertise</h3>
                                        <ul className="space-y-4 mb-8">
                                            {certifications.filter(c => c.category === 'Core').map((cert, index) => (
                                                <li key={index} className="flex items-start gap-3 group bg-brand-card-light rounded-xl p-3 shadow-md hover:scale-[1.02] transition-transform">
                                                    <span className="mt-1 flex-shrink-0 w-8 h-8 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center border border-brand-success/20">
                                                        <ShieldCheckIcon className="w-5 h-5 stroke-2" />
                                                    </span>
                                                    <div>
                                                        <span className="font-bold text-brand-body-light text-sm block">{cert.name}</span>
                                                        <span className="text-xs text-gray-500 font-medium">{cert.issuer} • {cert.year}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Experiments Section */}
                                        <div className="border-t border-gray-800 pt-6">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                                                Experiments & Fun
                                            </h4>
                                            <ul className="space-y-3">
                                                {certifications.filter(c => c.category === 'Experimental').map((cert, index) => (
                                                    <li key={index} className="flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                                        <span className="mt-1 flex-shrink-0 text-brand-body-dark group-hover:text-brand-primary transition-colors">
                                                            <BeakerIcon className="w-5 h-5 stroke-2" />
                                                        </span>
                                                        <div>
                                                            <span className="font-medium text-gray-300 text-sm">{cert.name}</span>
                                                            <span className="text-xs text-gray-500 block">{cert.issuer}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'education' && (
                                <motion.div
                                    key="education"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="grid gap-6 md:grid-cols-2"
                                >
                                    {education.map((edu, index) => (
                                        <div key={index} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-bold mb-4">{edu.year}</span>
                                            <h3 className="text-xl font-bold mb-2 text-brand-body-light">{edu.degree}</h3>
                                            <p className="text-gray-500">{edu.school}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-16 text-center">
                <a href="#journal" className="inline-flex flex-col items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors group">
                    <span className="uppercase tracking-widest text-[10px]">Read my thoughts</span>
                    <span className="group-hover:translate-y-1 transition-transform">↓</span>
                </a>
            </div>
        </section>
    );
};

export default Resume;
