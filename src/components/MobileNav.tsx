"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    BriefcaseIcon,
    CpuChipIcon,
    UserIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

const navItems = [
    { id: 'hero', label: 'Home', icon: HomeIcon },
    { id: 'projects', label: 'Work', icon: BriefcaseIcon },
    { id: 'services', label: 'Services', icon: CpuChipIcon },
    { id: 'resume', label: 'Resume', icon: UserIcon },
    { id: 'contact', label: 'Contact', icon: EnvelopeIcon },
];

export default function MobileNav() {
    const [activeSection, setActiveSection] = useState('hero');
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Scroll Detection (Hide on scroll down, show on scroll up)
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine active section
            const scrollCenter = currentScrollY + window.innerHeight / 2;
            for (const item of navItems) {
                const element = document.getElementById(item.id);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;
                    if (scrollCenter >= offsetTop && scrollCenter < offsetBottom) {
                        setActiveSection(item.id);
                    }
                }
            }

            // Hide/Show logic
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Scrolling down
            } else {
                setIsVisible(true); // Scrolling up
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80, // Offset for top content if needed
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 left-4 right-4 z-50 lg:hidden"
                >
                    <nav className="gravity-repulse bg-brand-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        <ul className="flex justify-between items-center px-2 py-3">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <li key={item.id} className="flex-1">
                                        <button
                                            onClick={() => scrollTo(item.id)}
                                            className="w-full flex flex-col items-center gap-1 p-2 relative group"
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute -top-3 w-8 h-1 bg-brand-primary rounded-full shadow-[0_0_10px_var(--brand-primary)]"
                                                />
                                            )}
                                            <item.icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-brand-primary' : 'text-gray-400 group-hover:text-gray-200'}`} />
                                            <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-brand-primary' : 'text-gray-500'}`}>
                                                {item.label}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/5 to-transparent pointer-events-none" />
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
