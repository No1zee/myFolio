"use client";

import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import AvatarPlaceholder from './AvatarPlaceholder';


const Hero = () => {
    const { scrollY } = useScroll();
    const [isProfileExpanded, setIsProfileExpanded] = useState(false);
    const y1 = useTransform(scrollY, [0, 500], [0, 150]); // Intensified parallax
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);


    // Static content
    const title = "Hi, I'm Edward.";
    const desc = "I am an IT professional with diverse experience across infrastructure, policy, administration, and web development. I serve as a Swiss Army knife for versatile precision or a blunt instrument for decisive impact, adapting my approach to exactly what is required.";

    return (
        <section className="flex flex-col lg:flex-row items-center justify-center min-h-[90vh] px-6 relative z-0 overflow-hidden pt-24 pb-12 gap-16 max-w-[1200px] mx-auto" >

            {/* Background Blobs (Parallax + Layered) */}
            < motion.div
                style={{ y: y1, opacity }}
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/6 -right-32 w-[500px] h-[500px] bg-pink/10 rounded-full blur-[100px] -z-10 pointer-events-none"
            />
            <motion.div
                style={{ y: y2, opacity }}
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 50, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/6 -left-32 w-[400px] h-[400px] bg-blue/10 rounded-full blur-[100px] -z-10 pointer-events-none"
            />

            {/* Left Content */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
                }}
                className="flex-1 text-center lg:text-left z-10"
            >

                <div className="inline-block animate-fade-in">
                    <span className="py-1 px-4 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold mb-6 border border-brand-primary/20 tracking-widest">
                        IT INFRASTRUCTURE EXPERT
                    </span>
                </div>

                <h1 className="gravity-repulse inline-block text-4xl md:text-7xl font-bold mb-6 tracking-tight text-brand-body-light leading-[1.1] animate-fade-in-up">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">
                        {title}
                    </span>
                </h1>

                <p className="gravity-repulse inline-block text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-6 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {desc}
                </p>



                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                    <motion.a
                        href="#contact"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(29 78 216 / 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="gravity-repulse bg-brand-primary text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:bg-blue-600"
                    >
                        Book Consultation
                    </motion.a>
                    <motion.a
                        href="#projects"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(255 255 255 / 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        className="gravity-repulse bg-white/5 backdrop-blur-sm text-gray-200 border border-white/10 px-8 py-4 rounded-full font-bold transition-all hover:bg-white/10 hover:text-white"
                    >
                        View Case Studies
                    </motion.a>
                </motion.div>
            </motion.div>

            {/* Right Content - Terminal/Dashboard */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5, type: "spring" }}
                className="flex-1 w-full max-w-lg lg:max-w-xl perspective-1000 group cursor-pointer"
            >
                {/* Console Container */}
                <motion.div
                    className="relative w-72 h-72 md:w-96 md:h-96 mx-auto bg-gray-900/80 backdrop-blur-xl border border-brand-primary/30 rounded-full flex items-center justify-center shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)] overflow-hidden group-hover:border-brand-primary/60 transition-colors duration-500"
                    whileHover={{ rotateX: 5, rotateY: 5 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    {/* Spinning Rings */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-brand-primary/20 animate-[spin_20s_linear_infinite]"></div>
                    <div className="absolute inset-4 rounded-full border border-dotted border-brand-secondary/20 animate-[spin_15s_linear_infinite_reverse]"></div>

                    {/* Scan Line */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/10 to-transparent w-full h-full -translate-y-[150%] animate-[scan_4s_ease-in-out_infinite] pointer-events-none group-hover:animate-[scan_2s_ease-in-out_infinite]"></div>

                    {/* Internal Display */}
                    <div className="text-center z-10 relative">
                        <motion.div
                            className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 shadow-[0_0_30px_rgba(59,130,246,0.6)] cursor-pointer z-50"
                            style={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
                            whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.8)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsProfileExpanded(true)}
                            layoutId="profile-avatar"
                        >
                            <AvatarPlaceholder />
                            {/* Hologram Overlay */}
                            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay bg-[url('/grid.svg')] opacity-30 group-hover:opacity-0 transition-opacity duration-300"></div>
                        </motion.div>

                        <div className="space-y-1 font-mono text-xs text-brand-primary">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="bg-brand-primary/10 px-2 py-1 rounded inline-block border border-brand-primary/20"
                            >
                                STATUS: ONLINE
                            </motion.div>
                            <div className="text-[10px] text-brand-text-muted animate-pulse">
                                <span className="text-brand-success">●</span> SECURE CONN
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Orbiting Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gray-800/50 rounded-full -z-10 animate-pulse"></div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm hidden lg:block"
            >
                Scroll to Explore ↓
            </motion.div>
            {/* Profile Lightbox */}
            <AnimatePresence>
                {isProfileExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsProfileExpanded(false)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    >
                        <motion.div
                            layoutId="profile-avatar"
                            className="relative w-full max-w-lg aspect-square rounded-full overflow-hidden border-4 border-brand-primary shadow-[0_0_100px_rgba(59,130,246,0.5)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AvatarPlaceholder />
                            <button
                                onClick={() => setIsProfileExpanded(false)}
                                className="absolute top-8 right-8 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors z-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section >
    );
};

export default Hero;
