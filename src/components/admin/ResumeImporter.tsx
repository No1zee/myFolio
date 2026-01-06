"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpTrayIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ExtractedData {
    bio?: string;
    experience: any[];
    skills: any[];
    certifications: any[];
    services: any[];
    projects: any[];
}

const ResumeImporter = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState<ExtractedData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Polish State
    const [polishingField, setPolishingField] = useState<string | null>(null); // Field ID being polished
    const [suggestion, setSuggestion] = useState<{ fieldId: string, text: string } | null>(null);

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

    const handlePolish = async (text: string, fieldType: string, fieldId: string) => {
        if (!text) return;
        setPolishingField(fieldId);
        setSuggestion(null);

        try {
            const res = await fetch('/api/admin/polish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, fieldType }), // Send fieldType for better prompt
            });
            const data = await res.json();
            if (data.success) {
                setSuggestion({ fieldId, text: data.polishedText });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setPolishingField(null);
        }
    };

    const applySuggestion = (fieldId: string, newValue: string) => {
        if (!parsedData) return;

        if (fieldId === 'bio') {
            setParsedData({ ...parsedData, bio: newValue });
        } else if (fieldId.startsWith('exp-')) {
            const [_, indexStr, field] = fieldId.split('-');
            const index = parseInt(indexStr);
            const newExp = [...(parsedData.experience || [])];
            if (newExp[index]) {
                newExp[index] = { ...newExp[index], [field]: newValue };
                setParsedData({ ...parsedData, experience: newExp });
            }
        } else if (fieldId.startsWith('proj-')) {
            const [_, indexStr, field] = fieldId.split('-');
            const index = parseInt(indexStr);
            const newProj = [...(parsedData.projects || [])];
            if (newProj[index]) {
                newProj[index] = { ...newProj[index], [field]: newValue };
                setParsedData({ ...parsedData, projects: newProj });
            }
        }
        setSuggestion(null);
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
                                    className={`px - 6 py - 2 rounded - lg font - bold flex items - center gap - 2 ${saveStatus === 'success' ? 'bg-green-500' : 'bg-brand-primary'
                                        } text - white shadow - lg shadow - brand - primary / 25`}
                                >
                                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Confirm & Save'}
                                </motion.button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Bio Editor */}
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-brand-primary font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                                        Professional Summary
                                    </h3>
                                    <button
                                        onClick={() => handlePolish(parsedData.bio || '', 'bio', 'bio')}
                                        disabled={polishingField === 'bio'}
                                        className="bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-xs uppercase font-bold"
                                    >
                                        <SparklesIcon className={`w-4 h-4 ${polishingField === 'bio' ? 'animate-spin' : ''}`} />
                                        {polishingField === 'bio' ? 'Polishing...' : 'Polish with AI'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={parsedData.bio || ''}
                                        onChange={(e) => setParsedData({ ...parsedData, bio: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none min-h-[100px]"
                                        placeholder="Enter professional bio..."
                                    />
                                    {/* Suggestion Bubble */}
                                    <AnimatePresence>
                                        {suggestion?.fieldId === 'bio' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute z-10 bottom-full left-0 mb-2 w-full bg-gray-800 border border-brand-primary/50 shadow-xl rounded-xl p-4"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-brand-primary text-xs font-bold uppercase flex items-center gap-1">
                                                        <SparklesIcon className="w-3 h-3" /> AI Suggestion
                                                    </span>
                                                    <button onClick={() => setSuggestion(null)} className="text-gray-500 hover:text-white"><XCircleIcon className="w-5 h-5" /></button>
                                                </div>
                                                <p className="text-white text-sm mb-4">{suggestion.text}</p>
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => setSuggestion(null)}
                                                        className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 rounded-lg"
                                                    >
                                                        Discard
                                                    </button>
                                                    <button
                                                        onClick={() => applySuggestion('bio', suggestion.text)}
                                                        className="px-3 py-1.5 text-xs bg-brand-primary text-white font-bold rounded-lg shadow-lg shadow-brand-primary/20"
                                                    >
                                                        Apply Suggestion
                                                    </button>
                                                </div>
                                                {/* Arrow */}
                                                <div className="absolute top-full left-8 w-3 h-3 bg-gray-800 border-r border-b border-brand-primary/50 transform rotate-45 -mt-1.5"></div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Experience Editor */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white pl-2">Experience</h3>
                                {parsedData.experience?.map((exp: any, index: number) => (
                                    <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative group hover:border-gray-700 transition-colors">
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <label className="text-xs text-gray-500 uppercase font-bold ml-1 block">Role</label>
                                                    <button
                                                        onClick={() => handlePolish(exp.role || '', 'role', `exp-${index}-role`)}
                                                        disabled={polishingField === `exp-${index}-role`}
                                                        className="text-brand-primary hover:text-white hover:bg-brand-primary/20 px-2 py-1 rounded transition-colors flex items-center gap-1 text-[10px] uppercase font-bold"
                                                    >
                                                        <SparklesIcon className={`w-3 h-3 ${polishingField === `exp-${index}-role` ? 'animate-spin' : ''}`} />
                                                        Polish
                                                    </button>
                                                </div>
                                                <div className="relative">
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
                                                    {/* Role Bubble */}
                                                    <AnimatePresence>
                                                        {suggestion?.fieldId === `exp-${index}-role` && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="absolute z-20 top-full left-0 mt-2 w-64 bg-gray-800 border border-brand-primary/50 shadow-xl rounded-xl p-3"
                                                            >
                                                                <p className="text-white text-sm mb-2">{suggestion.text}</p>
                                                                <div className="flex gap-2 justify-end">
                                                                    <button onClick={() => setSuggestion(null)} className="text-xs text-gray-400">Cancel</button>
                                                                    <button onClick={() => applySuggestion(`exp-${index}-role`, suggestion.text)} className="text-xs text-brand-primary font-bold">Apply</button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
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
                                            <div className="flex justify-between mb-1">
                                                <label className="text-xs text-gray-500 uppercase font-bold ml-1 block">Description (Markdown)</label>
                                                <button
                                                    onClick={() => {
                                                        const desc = Array.isArray(exp.description) ? exp.description.map((d: string) => `- ${d}`).join('\n') : (exp.description || '');
                                                        handlePolish(desc, 'description', `exp-${index}-desc`);
                                                    }}
                                                    disabled={polishingField === `exp-${index}-desc`}
                                                    className="bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-[10px] uppercase font-bold"
                                                >
                                                    <SparklesIcon className={`w-3 h-3 ${polishingField === `exp-${index}-desc` ? 'animate-spin' : ''}`} />
                                                    Polish Points
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <textarea
                                                    value={Array.isArray(exp.description) ? exp.description.map((d: string) => `- ${d}`).join('\n') : (exp.description || '')}
                                                    onChange={(e) => {
                                                        const newExp = [...(parsedData.experience || [])];
                                                        newExp[index] = { ...newExp[index], description: e.target.value };
                                                        setParsedData({ ...parsedData, experience: newExp });
                                                    }}
                                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-gray-300 focus:border-brand-primary outline-none min-h-[120px] font-mono text-sm"
                                                />
                                                {/* Description Bubble */}
                                                <AnimatePresence>
                                                    {suggestion?.fieldId === `exp-${index}-desc` && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="absolute z-20 bottom-full left-0 mb-2 w-full bg-gray-800 border border-green-500/50 shadow-xl rounded-xl p-4"
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className="text-green-400 text-xs font-bold uppercase flex items-center gap-1">
                                                                    <SparklesIcon className="w-3 h-3" /> Polished Version
                                                                </span>
                                                                <button onClick={() => setSuggestion(null)} className="text-gray-500 hover:text-white"><XCircleIcon className="w-5 h-5" /></button>
                                                            </div>
                                                            <p className="text-white text-sm mb-4 whitespace-pre-line max-h-40 overflow-y-auto">{suggestion.text}</p>
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => setSuggestion(null)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 rounded-lg">Discard</button>
                                                                <button onClick={() => applySuggestion(`exp-${index}-desc`, suggestion.text)} className="px-3 py-1.5 text-xs bg-green-500 text-white font-bold rounded-lg shadow-lg">Apply</button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
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

                            {/* Services Editor */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white pl-2">Capabilities (Services)</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {parsedData.services?.map((svc: any, index: number) => (
                                        <div key={index} className="bg-gray-900 border border-gray-800 p-4 rounded-xl relative group hover:border-brand-primary/50 transition-colors">
                                            <input
                                                type="text"
                                                value={svc.title || ''}
                                                onChange={(e) => {
                                                    const newSvc = [...(parsedData.services || [])];
                                                    newSvc[index] = { ...newSvc[index], title: e.target.value };
                                                    setParsedData({ ...parsedData, services: newSvc });
                                                }}
                                                className="w-full bg-transparent font-bold text-white mb-2 border-b border-transparent focus:border-brand-primary outline-none"
                                                placeholder="Service Title"
                                            />
                                            <textarea
                                                value={svc.description || ''}
                                                onChange={(e) => {
                                                    const newSvc = [...(parsedData.services || [])];
                                                    newSvc[index] = { ...newSvc[index], description: e.target.value };
                                                    setParsedData({ ...parsedData, services: newSvc });
                                                }}
                                                className="w-full bg-black/30 rounded p-2 text-sm text-gray-400 min-h-[60px] outline-none focus:ring-1 focus:ring-brand-primary"
                                                placeholder="Description..."
                                            />
                                            <button
                                                onClick={() => {
                                                    const newSvc = parsedData.services.filter((_, i) => i !== index);
                                                    setParsedData({ ...parsedData, services: newSvc });
                                                }}
                                                className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <XCircleIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Projects Editor */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white pl-2">Achievements (Projects)</h3>
                                {parsedData.projects?.map((proj: any, index: number) => (
                                    <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative group hover:border-gray-700 transition-colors">
                                        <div className="flex justify-between mb-2">
                                            <input
                                                type="text"
                                                value={proj.title || ''}
                                                onChange={(e) => {
                                                    const newProj = [...(parsedData.projects || [])];
                                                    newProj[index] = { ...newProj[index], title: e.target.value };
                                                    setParsedData({ ...parsedData, projects: newProj });
                                                }}
                                                className="bg-transparent font-bold text-lg text-white border-b border-transparent focus:border-brand-primary outline-none"
                                                placeholder="Project Title"
                                            />
                                            <button
                                                onClick={() => handlePolish(proj.description || '', 'description', `proj-${index}-desc`)}
                                                disabled={polishingField === `proj-${index}-desc`}
                                                className="text-brand-primary hover:text-white px-2 py-1 flex items-center gap-1 text-[10px] uppercase font-bold"
                                            >
                                                <SparklesIcon className={`w-3 h-3 ${polishingField === `proj-${index}-desc` ? 'animate-spin' : ''}`} />
                                                Polish
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                value={proj.description || ''}
                                                onChange={(e) => {
                                                    const newProj = [...(parsedData.projects || [])];
                                                    newProj[index] = { ...newProj[index], description: e.target.value };
                                                    setParsedData({ ...parsedData, projects: newProj });
                                                }}
                                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-gray-300 focus:border-brand-primary outline-none min-h-[80px] text-sm"
                                                placeholder="Project details..."
                                            />
                                            {/* Project Bubble */}
                                            <AnimatePresence>
                                                {suggestion?.fieldId === `proj-${index}-desc` && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="absolute z-20 top-full left-0 mt-2 w-full bg-gray-800 border border-green-500/50 shadow-xl rounded-xl p-3"
                                                    >
                                                        <p className="text-white text-sm mb-2">{suggestion.text}</p>
                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => setSuggestion(null)} className="text-xs text-gray-400">Discard</button>
                                                            <button onClick={() => applySuggestion(`proj-${index}-desc`, suggestion.text)} className="text-xs bg-green-500 text-white font-bold px-2 py-1 rounded">Apply</button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                ))}
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
        </div >
    );
};

export default ResumeImporter;
