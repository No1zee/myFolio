"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpTrayIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ExtractedData {
    bio?: string;
    experience: any[];
    skills: any[];
    certifications: any[];
}

const ResumeImporter = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState<ExtractedData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleParse = async () => {
        if (!file) return;

        setIsParsing(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/resume/parse', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to parse resume');

            const data = await res.json();
            if (data.success) {
                setParsedData(data.data);
            } else {
                throw new Error(data.error || 'Unknown parsing error');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Parsing failed');
        } finally {
            setIsParsing(false);
        }
    };

    const handleSave = async () => {
        if (!parsedData) return;
        setSaveStatus('saving');

        // TODO: Implement Bulk Save API
        // For now, we simulate a save or just log it
        try {
            const res = await fetch('/api/admin/resume/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedData),
            });
            if (!res.ok) throw new Error("Save failed");

            setSaveStatus('success');
            setTimeout(() => {
                setSaveStatus('idle');
                setParsedData(null);
                setFile(null);
            }, 2000);
        } catch (err) {
            console.error(err);
            setSaveStatus('error');
        }
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-primary/20 rounded-xl text-brand-primary">
                    <DocumentTextIcon className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Smart Resume Importer</h2>
                    <p className="text-gray-400">Upload your CV to auto-update your portfolio.</p>
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {!parsedData ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center hover:border-brand-primary/50 transition-colors"
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume-upload"
                        />
                        <label
                            htmlFor="resume-upload"
                            className="cursor-pointer flex flex-col items-center gap-4"
                        >
                            <ArrowUpTrayIcon className="w-12 h-12 text-gray-500" />
                            {file ? (
                                <span className="text-brand-primary font-bold text-lg">{file.name}</span>
                            ) : (
                                <span className="text-gray-400 text-lg">Click to Upload PDF</span>
                            )}
                        </label>

                        {file && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleParse}
                                disabled={isParsing}
                                className="mt-8 px-8 py-3 bg-brand-primary text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                            >
                                {isParsing ? 'Unlocking Secrets...' : 'Parse Resume'}
                            </motion.button>
                        )}

                        {error && <p className="mt-4 text-red-400">{error}</p>}
                    </motion.div>
                ) : (
                    <motion.div
                        key="review"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl">
                            <span className="text-green-400 flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5" /> Analysis Complete
                            </span>
                            <button onClick={() => setParsedData(null)} className="text-gray-400 hover:text-white">Cancel</button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Summary */}
                            <div className="md:col-span-2 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                                <h3 className="text-brand-primary font-bold mb-2">New Bio</h3>
                                <p className="text-gray-300 italic">"{parsedData.bio}"</p>
                            </div>

                            {/* Stats */}
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <h4 className="text-gray-400 text-xs uppercase uppercase mb-1">Experience Items</h4>
                                <div className="text-3xl font-bold text-white">{parsedData.experience?.length || 0}</div>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <h4 className="text-gray-400 text-xs uppercase uppercase mb-1">Skills Found</h4>
                                <div className="text-3xl font-bold text-white">
                                    {parsedData.skills?.reduce((acc: number, cat: any) => acc + cat.items.length, 0) || 0}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={saveStatus === 'saving'}
                                className={`px-8 py-4 rounded-full font-bold flex items-center gap-2 ${saveStatus === 'success' ? 'bg-green-500' : 'bg-brand-primary'
                                    } text-white`}
                            >
                                {saveStatus === 'saving' ? 'Committing to Database...' : saveStatus === 'success' ? 'Database Updated!' : 'Confirm & Updates Portfolio'}
                            </motion.button>
                        </div>
                        {saveStatus === 'error' && <p className="text-red-400 text-right mt-2">Update failed. Check console.</p>}

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeImporter;
