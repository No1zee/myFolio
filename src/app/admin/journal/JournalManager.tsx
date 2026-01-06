"use client";

import { useState } from "react";
import { createJournalEntry, updateJournalEntry, deleteJournalEntry } from "@/app/actions/portfolio";

export type JournalEntry = {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string; // JSON
    stardate: string;
    date: Date;
}

export default function JournalManager({ initialLogs }: { initialLogs: JournalEntry[] }) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        stardate: new Date().toISOString().split('T')[0].replace(/-/g, '.'), // simplistic
        category: "Updates",
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
            tags: parsedTags,
            content: log.content
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: "", stardate: "", category: "Updates", tags: "", content: "" });
    };

    return (
        <div className="space-y-10">
            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingId ? "Edit Log Entry" : "New Captain's Log"}
                    </h2>
                    {editingId && (
                        <button onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form action={async (formData) => {
                    const rawTags = formData.get("tags") as string;
                    const tagsArray = rawTags.split(',').map(s => s.trim()).filter(Boolean);
                    formData.set("tags", JSON.stringify(tagsArray));

                    if (editingId) {
                        await updateJournalEntry(editingId, formData);
                        handleCancelEdit();
                    } else {
                        await createJournalEntry(formData);
                        handleCancelEdit();
                    }
                }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stardate</label>
                            <input
                                name="stardate"
                                value={formData.stardate}
                                onChange={(e) => setFormData({ ...formData, stardate: e.target.value })}
                                required
                                placeholder="2025.12.01"
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                list="journal-categories"
                                name="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                            <datalist id="journal-categories">
                                <option value="Updates" />
                                <option value="Tech" />
                                <option value="Insights" />
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tags (Comma separated)</label>
                            <input
                                name="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="Next.js, AI..."
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            rows={4}
                            className="mt-1 w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <button type="submit" className={`text-white px-6 py-2 rounded-lg font-medium transition-colors ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {editingId ? "Update Log" : "Record Entry"}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="space-y-4">
                {initialLogs.map((log) => (
                    <div key={log.id} className="bg-white p-6 rounded-xl shadow border border-gray-100 items-start flex flex-col md:flex-row gap-4">
                        <div className="w-32 flex-shrink-0 text-sm text-gray-500 font-mono">
                            <div className="text-blue-600 font-bold">{log.stardate}</div>
                            <div>{log.category}</div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{log.title}</h3>
                            <p className="text-gray-600 mt-1 mb-2 leading-relaxed">{log.content}</p>
                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                    try {
                                        return JSON.parse(log.tags).map((t: string, i: number) => (
                                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">#{t}</span>
                                        ));
                                    } catch { return null; }
                                })()}
                            </div>
                        </div>
                        <div className="flex gap-2 self-start">
                            <button
                                onClick={() => handleEdit(log)}
                                className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded text-sm hover:bg-blue-50 transition-colors"
                            >
                                Edit
                            </button>
                            <form action={async () => {
                                if (confirm("Delete log entry?")) {
                                    await deleteJournalEntry(log.id);
                                }
                            }}>
                                <button type="submit" className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded text-sm hover:bg-red-50 transition-colors">
                                    Delete
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
