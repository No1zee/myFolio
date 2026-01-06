"use client";

import React, { useState } from 'react';
import { PhoneIcon, EnvelopeIcon, LinkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionStore } from '@/lib/store';

const Footer = () => {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState('submitting');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setFormState('success');
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setFormState('idle'), 5000);
            } else {
                console.error("Form submission failed");
                setFormState('error');
                setTimeout(() => setFormState('idle'), 3000);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setFormState('error');
            setTimeout(() => setFormState('idle'), 3000);
        }
    };

    return (

        <footer id="contact" className="bg-brand-bg text-white py-20 px-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-success to-brand-primary"></div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
                {/* Contact Info */}
                <div>
                    <h3 className="text-4xl font-bold mb-6 text-brand-heading">Let&apos;s Connect</h3>
                    <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                        Whether you need a systems overhaul, security audit, or just want to chat tech, I&apos;m currently open to roles in Harare or remote.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 text-gray-300">
                            <a href="tel:+263777725171" className="flex items-center gap-4 hover:text-white transition-colors">
                                <span className="p-3 bg-brand-surface rounded-full border border-gray-800 text-brand-primary">
                                    <PhoneIcon className="w-5 h-5 stroke-2" />
                                </span>
                                <span className="font-medium">+263 777 725 171</span>
                            </a>
                        </div>
                        <div className="flex items-center gap-4 text-gray-300">
                            <a href="mailto:edwardmagejo@gmail.com" className="flex items-center gap-4 hover:text-white transition-colors">
                                <span className="p-3 bg-brand-surface rounded-full border border-gray-800 text-brand-primary">
                                    <EnvelopeIcon className="w-5 h-5 stroke-2" />
                                </span>
                                <span className="font-medium">edwardmagejo@gmail.com</span>
                            </a>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <a
                            href="https://linkedin.com/in/it-eddie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-brand-surface text-white rounded-full font-bold hover:bg-brand-surface-alt transition-all hover:-translate-y-1 flex items-center gap-2 border border-brand-primary/30 hover:border-brand-primary"
                        >
                            <span>Link with me on LinkedIn</span>
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-colors duration-1000"></div>

                    <div className="grid md:grid-cols-2 gap-12 relative z-10">
                        {/* LEFT COLUMN: CONTEXT & CHECKLIST */}
                        <div className="text-left space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Initiate Contact</h3>
                                <p className="text-gray-400">Secure channel open. Ready for inquiry.</p>
                            </div>

                            {/* "What happens next" Checklist */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-4">Transmission Protocol</h4>
                                <ul className="space-y-3">
                                    {[
                                        "Automated receipt confirmation sent immediately",
                                        "Initial technical assessment within 24 hours",
                                        "Scheduling of deep-dive consultation"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <div className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors">
                                    <EnvelopeIcon className="w-5 h-5" />
                                    <span className="text-sm">encrypted@edwardmagejo.com</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors">
                                    <PhoneIcon className="w-5 h-5" />
                                    <span className="text-sm">+263 700 000 000</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: FORM */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {formState === 'success' ? (
                                    <motion.div
                                        key="success-message"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-center p-6 bg-brand-success/5 border border-brand-success/20 rounded-2xl"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-brand-success/20 flex items-center justify-center mb-4 text-brand-success text-3xl">
                                            ✓
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Transmission Received</h3>
                                        <p className="text-gray-400 text-sm mb-6">
                                            Stand by for response sequence.
                                        </p>
                                        <a href="#projects" className="text-sm font-bold text-brand-primary hover:text-white transition-colors border-b border-brand-primary/30 pb-1">
                                            While you wait, explore case studies →
                                        </a>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="contact-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder=" "
                                                required
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all peer pt-5 pb-2"
                                            />
                                            <label className="absolute left-4 top-3 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand-primary pointer-events-none">
                                                Identity / Name
                                            </label>
                                        </div>
                                        <div className="relative group/input">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder=" "
                                                required
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all peer pt-5 pb-2"
                                            />
                                            <label className="absolute left-4 top-3 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand-primary pointer-events-none">
                                                Comms Frequency / Email
                                            </label>
                                        </div>
                                        <div className="relative group/input">
                                            <textarea
                                                name="message"
                                                rows={4}
                                                placeholder=" "
                                                required
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all peer pt-5 pb-2 resize-none"
                                            ></textarea>
                                            <label className="absolute left-4 top-3 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand-primary pointer-events-none">
                                                Mission Parameter / Message
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={formState === 'submitting'}
                                            className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                                        >
                                            <span className="group-hover/btn:tracking-widest transition-all duration-300">
                                                {formState === 'submitting' ? 'Transmitting...' : 'Establish Link'}
                                            </span>
                                            {formState !== 'submitting' && <ArrowTopRightOnSquareIcon className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>
            </motion.div >

            <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm gap-4">
                <p>&copy; {new Date().getFullYear()} Edward Magejo. All rights reserved.</p>
                <button
                    onClick={() => useMissionStore.getState().toggleDiagnostics()}
                    className="hover:text-brand-primary transition-colors text-xs uppercase tracking-widest flex items-center gap-2 opacity-50 hover:opacity-100"
                >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    System Status
                </button>
            </div>
        </footer >
    );
};

export default Footer;
