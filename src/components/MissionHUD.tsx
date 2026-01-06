"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionStore } from '@/lib/store';
import { CheckCircleIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const MissionHUD = () => {
    const { tasks } = useMissionStore();
    const [isOpen, setIsOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Calculate progress
    const completedCount = Object.values(tasks).filter(Boolean).length;
    const totalCount = Object.keys(tasks).length;
    const progress = (completedCount / totalCount) * 100;
    const isComplete = progress === 100;

    useEffect(() => {
        if (isComplete) {
            setIsOpen(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }
    }, [isComplete]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <motion.div
                layout
                className={`gravity-repulse bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-lg overflow-hidden shadow-2xl w-64 transition-all duration-300 ${isOpen ? 'h-auto' : 'h-12'}`}
            >
                {/* Header / Toggle */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isComplete ? 'bg-green-500 animate-pulse' : 'bg-brand-primary'}`} />
                        <span className="text-xs font-bold font-mono tracking-wider text-gray-300 uppercase">
                            Mission Status
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-brand-primary">{Math.round(progress)}%</span>
                        {isOpen ? <ChevronDownIcon className="w-3 h-3 text-gray-500" /> : <ChevronUpIcon className="w-3 h-3 text-gray-500" />}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-0.5 w-full bg-gray-800">
                    <motion.div
                        className="h-full bg-brand-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Task List */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-4 space-y-3"
                        >
                            <TaskItem label="Identify Role" completed={tasks.identified} />
                            <TaskItem label="Analyze Case Study" completed={tasks.viewedProject} />
                            <TaskItem label="Review Intel Log" completed={tasks.readLog} />
                            <TaskItem label="Establish Link" completed={tasks.contacted} />

                            {isComplete && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 text-center p-2 bg-brand-primary/10 rounded border border-brand-primary/20"
                                >
                                    <p className="text-xs text-brand-primary font-bold">MISSION ACCOMPLISHED</p>
                                    <p className="text-[10px] text-gray-400">System access fully granted.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

const TaskItem = ({ label, completed }: { label: string, completed: boolean }) => (
    <div className="flex items-center justify-between group">
        <span className={`text-xs font-mono transition-colors ${completed ? 'text-gray-400 line-through decoration-brand-primary/50' : 'text-gray-300'}`}>
            {label}
        </span>
        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${completed ? 'bg-brand-primary/20 border-brand-primary' : 'border-gray-700 bg-gray-800'}`}>
            {completed && <CheckCircleIcon className="w-3 h-3 text-brand-primary" />}
        </div>
    </div>
);

export default MissionHUD;
