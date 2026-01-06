"use client";

import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { createJournalEntry, updateJournalEntry, deleteJournalEntry } from "@/app/actions/portfolio";
import { EyeIcon, PencilSquareIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'; // Importing icons

export type JournalEntry = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    category: string;
    tags: string; // JSON
    stardate: string;
    date: Date;
}

export default function JournalManager({ initialLogs }: { initialLogs: JournalEntry[] }) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const [formData, setFormData] = useState({
        title: "",
        stardate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        category: "Updates",
        imageUrl: "",
        tags: "",
        content: ""
    });

    const handleEdit = (log: JournalEntry) => {
        setEditingId(log.id);
        const parsedTags = (() => {
            try { return JSON.parse(log.tags).join(", "); }
            catch { return log.tags; }
        })();

        setFormData({
            title: log.title,
            stardate: log.stardate,
            category: log.category,
            imageUrl: log.imageUrl || "",
            tags: parsedTags,
            content: log.content
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: "", stardate: "", category: "Updates", imageUrl: "", tags: "", content: "" });
        setViewMode('edit');
    };

    const insertText = (before: string, after: string = "") => {
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content;

        const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);

        setFormData({ ...formData, content: newText });

        // Restore focus effectively
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            {/* Editor Container */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {editingId ? <PencilSquareIcon className="w-5 h-5" /> : <PencilSquareIcon className="w-5 h-5" />}
                        {editingId ? "Edit Captain's Log" : "New Entry"}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('edit')}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'edit' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Write
                        </button>
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1 ${viewMode === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <EyeIcon className="w-4 h-4" /> Preview
                        </button>
                        {editingId && (
                            <button onClick={handleCancelEdit} className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 ml-4">
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <form action={async (formPayload) => {
                        const rawTags = formPayload.get("tags") as string;
                        const tagsArray = rawTags.split(',').map(s => s.trim()).filter(Boolean);
                        formPayload.set("tags", JSON.stringify(tagsArray));

                        if (editingId) {
                            await updateJournalEntry(editingId, formPayload);
                            handleCancelEdit();
                        } else {
                            await createJournalEntry(formPayload);
                            handleCancelEdit();
                        }
                    }} className="space-y-6">

                        {/* Meta Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-8 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g. System Core Optimization V2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <PhotoIcon className="w-4 h-4" /> Cover Image URL
                                    </label>
                                    <input
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-4 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stardate</label>
                                    <input
                                        name="stardate"
                                        value={formData.stardate}
                                        onChange={(e) => setFormData({ ...formData, stardate: e.target.value })}
                                        required
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                    >
                                        <option value="Updates">Updates</option>
                                        <option value="Tech">Tech</option>
                                        <option value="Insights">Insights</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags</label>
                                    <input
                                        name="tags"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="React, AI, Infra"
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-bold text-gray-700">Entry Content</label>
                                {viewMode === 'edit' && (
                                    <div className="flex gap-1">
                                        <ToolbarBtn onClick={() => insertText('**', '**')} label="B" title="Bold" />
                                        <ToolbarBtn onClick={() => insertText('*', '*')} label="I" title="Italic" />
                                        <ToolbarBtn onClick={() => insertText('### ')} label="H3" title="Heading" />
                                        <ToolbarBtn onClick={() => insertText('`', '`')} label="<>" title="Code" />
                                        <ToolbarBtn onClick={() => insertText('- ')} label="List" title="Bullet List" />
                                        <ToolbarBtn onClick={() => insertText('> ')} label='""' title="Quote" />
                                        <ToolbarBtn onClick={() => insertText('[', '](url)')} label="Link" title="Link" />
                                    </div>
                                )}
                            </div>

                            {viewMode === 'edit' ? (
                                <textarea
                                    id="content-editor"
                                    name="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    rows={15}
                                    placeholder="Write your log entry here using Markdown..."
                                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm leading-relaxed"
                                />
                            ) : (
                                <div className="w-full px-6 py-6 border border-gray-200 rounded-lg bg-gray-50 min-h-[300px] prose prose-blue max-w-none">
                                    {formData.imageUrl && (
                                        <img src={formData.imageUrl} alt="Cover" className="w-full h-48 object-cover rounded-lg mb-6 shadow-sm" />
                                    )}
                                    <ReactMarkdown>{formData.content}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${editingId ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-emerald-500/30' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30'}`}
                            >
                                {editingId ? "Update Entry" : "Publish Entry"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest text-center mb-8">Recent Logs</h3>
                {initialLogs.map((log) => (
                    <div key={log.id} className="group bg-white p-1 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                        <div className="flex flex-col sm:flex-row gap-4 p-4">
                            {/* Thumb */}
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                                {log.imageUrl ? (
                                    <img src={log.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <PhotoIcon className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{log.stardate}</span>
                                        <span className="text-xs font-mono text-gray-500 ml-2">{log.category}</span>
                                        <h4 className="font-bold text-gray-900 text-lg mt-1 group-hover:text-blue-600 transition-colors">{log.title}</h4>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(log)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <form action={async () => {
                                            if (confirm("Delete this log?")) await deleteJournalEntry(log.id);
                                        }}>
                                            <button type="submit" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{log.content.substring(0, 150)}...</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const ToolbarBtn = ({ onClick, label, title }: { onClick: () => void, label: string, title: string }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 min-w-[30px]"
    >
        {label}
    </button>
);
