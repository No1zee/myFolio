"use client";

import { useState } from "react";
import { createCertification, updateCertification, deleteCertification } from "@/app/actions/portfolio";

export type Certification = {
    id: string;
    name: string;
    issuer: string;
    year: string;
    category: string;
    color: string;
    tech: string | null; // JSON string
    order: number;
}

export default function CertificationManager({ initialCerts }: { initialCerts: Certification[] }) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        issuer: "",
        year: new Date().getFullYear().toString(),
        category: "Cybersecurity",
        color: "from-blue-600 to-blue-400",
        tech: "[]"
    });

    const handleEdit = (cert: Certification) => {
        setEditingId(cert.id);
        const parsedTech = (() => {
            try { return JSON.parse(cert.tech || "[]").join(", "); }
            catch { return cert.tech || ""; }
        })();

        setFormData({
            name: cert.name,
            issuer: cert.issuer,
            year: cert.year,
            category: cert.category,
            color: cert.color,
            tech: parsedTech
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: "", issuer: "", year: "", category: "Cybersecurity", color: "from-blue-600 to-blue-400", tech: "[]" });
    };

    return (
        <div className="space-y-10">
            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingId ? "Edit Certification" : "Add Certification"}
                    </h2>
                    {editingId && (
                        <button onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form action={async (formData) => {
                    const rawTech = formData.get("tech") as string;
                    const techArray = rawTech.split(',').map(s => s.trim()).filter(Boolean);
                    formData.set("tech", JSON.stringify(techArray));

                    if (editingId) {
                        await updateCertification(editingId, formData);
                        handleCancelEdit();
                    } else {
                        await createCertification(formData);
                        handleCancelEdit();
                    }
                }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Issuer</label>
                            <input
                                name="issuer"
                                value={formData.issuer}
                                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                required
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <input
                                name="year"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                required
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                list="cert-categories"
                                name="category"
                                value={formData.category} // Basic select
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                            <datalist id="cert-categories">
                                <option value="Cybersecurity" />
                                <option value="Cloud" />
                                <option value="Emerging Tech" />
                                <option value="Other" />
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color (Gradient)</label>
                            <input
                                name="color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tech Stack (Comma separated)</label>
                        <input
                            name="tech"
                            value={formData.tech}
                            onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                            placeholder="React, Node.js..."
                            className="mt-1 w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <button type="submit" className={`text-white px-6 py-2 rounded-lg font-medium transition-colors ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {editingId ? "Update Certification" : "Add Certification"}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialCerts.map((cert) => (
                    <div key={cert.id} className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cert.color}`}></div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">{cert.name}</h3>
                            <p className="text-sm text-gray-500">{cert.issuer} • {cert.year}</p>
                            <span className="text-xs inline-block bg-gray-100 px-2 py-0.5 rounded mt-2 text-gray-600">{cert.category}</span>

                            <div className="flex flex-wrap gap-1 mt-3">
                                {(() => {
                                    try {
                                        return JSON.parse(cert.tech || "[]").map((t: string, i: number) => (
                                            <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">{t}</span>
                                        ));
                                    } catch { return null; }
                                })()}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 justify-end border-t pt-3">
                            <button
                                onClick={() => handleEdit(cert)}
                                className="text-blue-600 hover:text-blue-800 text-xs uppercase font-bold tracking-wider"
                            >
                                Edit
                            </button>
                            <form action={async () => {
                                if (confirm("Are you sure?")) {
                                    await deleteCertification(cert.id);
                                }
                            }}>
                                <button type="submit" className="text-red-500 hover:text-red-700 text-xs uppercase font-bold tracking-wider ml-2">
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
