"use client";

import React from 'react';
import { motion } from 'framer-motion';

const CustomSolutions = () => {
    return (
        <section className="relative py-32 px-6 overflow-hidden min-h-[80vh] flex items-center justify-center">
            {/* Background Grid & Glow */}
            <div className="absolute inset-0 bg-brand-bg opacity-90 z-0"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 z-0"></div>

            {/* Holographic Engine / Blueprint Animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                {/* Outer Ring - Housing */}
                <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -90 }}
                    whileInView={{ scale: 1, opacity: 0.2, rotate: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="w-[600px] h-[600px] border-2 border-brand-primary/30 rounded-full border-dashed animate-[spin_60s_linear_infinite]"
                />

                {/* Middle Ring - Stator */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.4 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "backOut" }}
                    viewport={{ once: true }}
                    className="absolute w-[450px] h-[450px] border border-cyan-500/40 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]"
                >
                    <div className="w-full h-full border-t-2 border-b-2 border-cyan-500/20 rounded-full"></div>
                </motion.div>

                {/* Inner Ring - Rotor */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.2, delay: 1.0, ease: "circOut" }}
                    viewport={{ once: true }}
                    className="absolute w-[300px] h-[300px] border-4 border-l-brand-accent/50 border-transparent rounded-full animate-[spin_3s_linear_infinite]"
                />
            </div>

            {/* Central "Core" Ignition */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] z-0 pointer-events-none">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                    viewport={{ once: true }}
                    className="absolute inset-0 bg-brand-primary/20 blur-[50px] rounded-full"
                />
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.0, type: "spring" }}
                    viewport={{ once: true }}
                    className="absolute inset-[30%] bg-white/10 backdrop-blur-md rounded-full border border-white/50 shadow-[0_0_50px_rgba(59,130,246,0.8)] animate-pulse"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-mono tracking-widest mb-6">
                        PROTOTYPE LAB
                    </span>

                    <h2 className="gravity-repulse text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-tight">
                        Need Something <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-primary to-purple-500">
                            Unique & Specific
                        </span> <br />
                        Built?
                    </h2>

                    <p className="gravity-repulse text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Standard tools have limits. I engineer bespoke systems tailored to your exact operational requirements—from complex automation pipelines to custom hardware integrations.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="gravity-repulse group relative px-8 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden flex items-center gap-2"
                        >
                            <span className="relative z-10">Initialize Project</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform">
                                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436-.067.052-.142.107-.223.165a.852.852 0 00-.08.067l-2.005 2.005a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 010-1.06l2.005-2.005c.026-.027.049-.054.067-.08a2.536 2.536 0 01.165-.223z" clipRule="evenodd" />
                                <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.5a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-.01zM7.5 15a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8.25A.75.75 0 017.5 15v-.01zM9 16.5a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v-.01z" />
                                <path d="M2.57 16.208a.75.75 0 01.996.344 7.5 7.5 0 002.667 3.25.75.75 0 11-.78 1.272 9 9 0 01-3.201-3.9.75.75 0 01.318-.966z" />
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-bg to-transparent"></div>
        </section>
    );
};

export default CustomSolutions;
