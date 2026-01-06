"use client";

import { useState } from "react";
import { createProject, updateProject, deleteProject } from "@/app/actions/portfolio";

export type Project = {
    id: string;
    title: string;
    description: string;
    tags: string;
    category: string;
    imageUrl: string | null;
    content: string | null;
    order: number;
}

export default function ProjectManager({ initialProjects }: { initialProjects: Project[] }) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tags: "",
        category: "Achievement",
        content: "",
        imageUrl: "bg-blue" // Using for Color
    });

    const handleEdit = (proj: Project) => {
        setEditingId(proj.id);
        setFormData({
            title: proj.title,
            description: proj.description,
            tags: proj.tags, // CSV
            category: proj.category,
            content: proj.content || "",
            imageUrl: proj.imageUrl || "bg-blue"
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: "", description: "", tags: "", category: "Achievement", content: "", imageUrl: "bg-blue" });
    };

    return (
        <div className="space-y-10">
            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingId ? "Edit Achievement" : "Add New Achievement"}
                    </h2>
                    {editingId && (
                        <button onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form action={async (formData) => {
                    if (editingId) {
                        await updateProject(editingId, formData);
                        handleCancelEdit();
                    } else {
                        await createProject(formData);
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
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color (bg-class)</label>
                            <input
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="bg-blue"
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tags (Comma separated)</label>
                            <input
                                name="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="Leadership, Audit..."
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={3}
                            className="mt-1 w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Case Study Content (Markdown)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={10}
                            placeholder="# The Challenge... \n\n# The Solution..."
                            className="mt-1 w-full px-4 py-2 border rounded-lg font-mono text-sm"
                        />
                    </div>
                    <button type="submit" className={`text-white px-6 py-2 rounded-lg font-medium transition-colors ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {editingId ? "Update Achievement" : "Add Achievement"}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initialProjects.map((proj) => (
                    <div key={proj.id} className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{proj.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600`}>{proj.imageUrl}</span>
                            </div>
                            <p className="text-gray-600 mb-4 text-sm">{proj.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {proj.tags.split(',').map((tag, i) => (
                                    <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100">{tag.trim()}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6 justify-end">
                            <button
                                onClick={() => handleEdit(proj)}
                                className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded text-sm hover:bg-blue-50 transition-colors"
                            >
                                Edit
                            </button>
                            <form action={async () => {
                                if (confirm("Are you sure?")) {
                                    await deleteProject(proj.id);
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
