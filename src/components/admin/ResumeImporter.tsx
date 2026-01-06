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
                        className="space-y-8"
                    >
                        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
                            <span className="text-green-400 flex items-center gap-2 font-bold">
                                <CheckCircleIcon className="w-6 h-6" /> Analysis Complete
                            </span>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setParsedData(null)}
                                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Discard
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={saveStatus === 'saving'}
                                    className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${saveStatus === 'success' ? 'bg-green-500' : 'bg-brand-primary'
                                        } text-white shadow-lg shadow-brand-primary/25`}
                                >
                                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Confirm & Save'}
                                </motion.button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Bio Editor */}
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                                <h3 className="text-brand-primary font-bold mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                                    Professional Summary
                                </h3>
                                <textarea
                                    value={parsedData.bio || ''}
                                    onChange={(e) => setParsedData({ ...parsedData, bio: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none min-h-[100px]"
                                    placeholder="Enter professional bio..."
                                />
                            </div>

                            {/* Experience Editor */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white pl-2">Experience</h3>
                                {parsedData.experience?.map((exp: any, index: number) => (
                                    <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative group hover:border-gray-700 transition-colors">
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Role</label>
                                                <input
                                                    type="text"
                                                    value={exp.role || ''}
                                                    onChange={(e) => {
                                                        const newExp = [...(parsedData.experience || [])];
                                                        newExp[index] = { ...newExp[index], role: e.target.value };
                                                        setParsedData({ ...parsedData, experience: newExp });
                                                    }}
                                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Company</label>
                                                <input
                                                    type="text"
                                                    value={exp.company || ''}
                                                    onChange={(e) => {
                                                        const newExp = [...(parsedData.experience || [])];
                                                        newExp[index] = { ...newExp[index], company: e.target.value };
                                                        setParsedData({ ...parsedData, experience: newExp });
                                                    }}
                                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Description (Markdown)</label>
                                            <textarea
                                                value={Array.isArray(exp.description) ? exp.description.map((d: string) => `- ${d}`).join('\n') : (exp.description || '')}
                                                onChange={(e) => {
                                                    const newExp = [...(parsedData.experience || [])];
                                                    newExp[index] = { ...newExp[index], description: e.target.value };
                                                    setParsedData({ ...parsedData, experience: newExp });
                                                }}
                                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-gray-300 focus:border-brand-primary outline-none min-h-[120px] font-mono text-sm"
                                            />
                                        </div>

                                        <button
                                            onClick={() => {
                                                const newExp = parsedData.experience.filter((_, i) => i !== index);
                                                setParsedData({ ...parsedData, experience: newExp });
                                            }}
                                            className="absolute top-4 right-4 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <XCircleIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setParsedData({
                                        ...parsedData,
                                        experience: [{ role: 'New Role', company: 'Company', description: '', startDate: new Date().toISOString() }, ...parsedData.experience]
                                    })}
                                    className="w-full py-3 border-2 border-dashed border-gray-800 rounded-xl text-gray-500 hover:border-brand-primary/50 hover:text-brand-primary transition-colors font-bold"
                                >
                                    + Add Role
                                </button>
                            </div>
                        </div>

                        {saveStatus === 'error' && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl text-center">
                                Something went wrong saving the resume. Please check the console.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeImporter;
