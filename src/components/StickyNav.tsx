"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
    { id: 'hero', label: 'Start' },
    { id: 'services', label: 'Capabilities' },
    { id: 'projects', label: 'Case Studies' },
    { id: 'certifications', label: 'Expertise' },
    { id: 'resume', label: 'Journey' },
    { id: 'contact', label: 'Contact' },
];

const StickyNav = () => {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section.id);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
            {sections.map((section) => (
                <div key={section.id} className="group relative flex items-center justify-end">
                    {/* Label (Tooltip style) */}
                    <div className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="text-xs font-bold text-brand-primary bg-brand-light/90 backdrop-blur-md px-2 py-1 rounded shadow-lg whitespace-nowrap border border-brand-primary/20">
                            {section.label}
                        </span>
                    </div>

                    {/* Indicator Dot */}
                    <button
                        onClick={() => scrollTo(section.id)}
                        className={`
                            relative w-3 h-3 rounded-full transition-all duration-300
                            ${activeSection === section.id
                                ? 'bg-brand-primary scale-125 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                                : 'bg-gray-600 hover:bg-gray-400'}
                        `}
                        aria-label={`Scroll to ${section.label}`}
                    >
                        {activeSection === section.id && (
                            <motion.div
                                layoutId="activeNavRing"
                                className="absolute -inset-1 border border-brand-primary rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        )}
                    </button>

                    {/* Connection Line segment (optional visual flair) */}
                    {section.id !== 'contact' && (
                        <div className={`absolute top-3 right-[5px] w-[1px] h-4 -z-10 ${activeSection === section.id ? 'bg-brand-primary/50' : 'bg-gray-800'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StickyNav;
