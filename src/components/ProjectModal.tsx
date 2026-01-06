"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface ProjectModalProps {
    project: any | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                    >
                        <div className="bg-gray-900 border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto relative flex flex-col">
                            {/* Header Image Area (Mock) */}
                            <div className="h-48 sm:h-64 bg-gradient-to-br from-brand-primary/20 via-gray-900 to-gray-900 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                                <div className="absolute bottom-6 left-6 sm:left-10">
                                    <span className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2 block">
                                        Case Study
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-bold text-white shadow-black drop-shadow-lg">
                                        {project.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-10 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3">Overview</h3>
                                    <p className="text-gray-400 leading-relaxed text-lg">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">
                                            The Challenge
                                        </h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            Legacy infrastructure was causing significant bottlenecks, leading to
                                            persistent downtime and security vulnerabilities that threatened business continuity.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">
                                            The Solution
                                        </h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            Implemented a comprehensive overhaul using {(function () { try { return JSON.parse(project.tags); } catch { return project.tags.split(',').map((t: string) => t.trim()); } })().slice(0, 2).join(' and ')},
                                            establishing a resilient, high-availability architecture.
                                        </p>
                                    </div>
                                </div>

                                {/* Metrics / Results */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h4 className="text-white font-bold mb-4">Key Results</h4>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl sm:text-3xl font-bold text-brand-primary">99.9%</div>
                                            <div className="text-xs text-gray-500 uppercase mt-1">Uptime</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl sm:text-3xl font-bold text-brand-primary">-40%</div>
                                            <div className="text-xs text-gray-500 uppercase mt-1">Costs</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl sm:text-3xl font-bold text-brand-primary">2x</div>
                                            <div className="text-xs text-gray-500 uppercase mt-1">Speed</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                        Technologies Used
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags && (function () { try { return JSON.parse(project.tags); } catch { return project.tags.split(',').map((t: string) => t.trim()); } })().map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono bg-brand-surface-alt text-gray-300 border border-gray-700">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="pt-6 border-t border-gray-800 flex justify-between items-center">
                                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-sm">
                                        Close Details
                                    </button>
                                    <div className="flex gap-4">
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 border border-brand-primary text-brand-primary px-6 py-3 rounded-full font-bold hover:bg-brand-primary/10 transition-colors"
                                            >
                                                <span>View Live Demo</span>
                                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                            </a>
                                        )}
                                        <a href="#contact" onClick={onClose} className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors">
                                            <span>Start Similar Project</span>
                                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
