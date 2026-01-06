"use client";

import { useState } from "react";
import { createExperience, updateExperience, deleteExperience } from "@/app/actions/portfolio";

export type Experience = {
    id: string;
    role: string;
    company: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    description: string;
    location: string | null;
}

export default function ExperienceManager({ initialExperiences }: { initialExperiences: Experience[] }) {
    // Initial State derived from props. 
    // In a real app we might rely on router.refresh() but local state gives instant feedback if we managed it fully manually.
    // For this Server Action implementation, we just render what's passed, 
    // but form submission will trigger revalidation.

    const [editingId, setEditingId] = useState<string | null>(null);
    // Form state for creating/editing
    const [formData, setFormData] = useState({
        role: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
    });

    const handleEdit = (exp: Experience) => {
        setEditingId(exp.id);
        setFormData({
            role: exp.role,
            company: exp.company,
            location: exp.location || "",
            startDate: new Date(exp.startDate).toISOString().split('T')[0],
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : "",
            isCurrent: exp.isCurrent,
            description: exp.description,
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ role: "", company: "", location: "", startDate: "", endDate: "", isCurrent: false, description: "" });
    };

    return (
        <div className="space-y-10">
            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingId ? "Edit Job" : "Add New Job"}
                    </h2>
                    {editingId && (
                        <button onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form action={async (formData) => {
                    if (editingId) {
                        await updateExperience(editingId, formData);
                        handleCancelEdit();
                    } else {
                        await createExperience(formData);
                        // Reset form manually or rely on uncontrolled inputs. 
                        // Since we use controlled inputs for edit support, we should reset them here.
                        handleCancelEdit(); // clears state
                    }
                }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <input
                                name="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                                placeholder="e.g. Software Engineer"
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company</label>
                            <input
                                name="company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                required
                                placeholder="e.g. Acme Corp"
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Remote"
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex items-center gap-4 mt-6">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    name="isCurrent"
                                    checked={formData.isCurrent}
                                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                I currently work here
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                disabled={formData.isCurrent}
                                className="mt-1 w-full px-4 py-2 border rounded-lg disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description (Markdown Supported)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={4}
                            placeholder="- Did cool stuff..."
                            className="mt-1 w-full px-4 py-2 border rounded-lg font-mono text-sm"
                        />
                    </div>
                    <button type="submit" className={`text-white px-6 py-2 rounded-lg font-medium transition-colors ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {editingId ? "Update Job" : "Add Job"}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Existing Experiences</h2>
                <div className="space-y-4">
                    {initialExperiences.map((exp) => (
                        <div key={exp.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 group">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{exp.role}</h3>
                                <p className="text-gray-600 font-medium">{exp.company}</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    {new Date(exp.startDate).toLocaleDateString()} -
                                    {exp.isCurrent ? " Present" : (exp.endDate ? ` ${new Date(exp.endDate).toLocaleDateString()}` : "")}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(exp)}
                                    className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded text-sm hover:bg-blue-50 transition-colors"
                                >
                                    Edit
                                </button>
                                <form action={async () => {
                                    if (confirm("Are you sure?")) {
                                        await deleteExperience(exp.id);
                                    }
                                }}>
                                    <button type="submit" className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded text-sm hover:bg-red-50 transition-colors">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                    {initialExperiences.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No experiences found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
