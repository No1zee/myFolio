"use client";

import { useState } from "react";
import { createService, updateService, deleteService } from "@/app/actions/portfolio";

export type Service = {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    features: string; // JSON string
    order: number;
}

export default function ServiceManager({ initialServices }: { initialServices: Service[] }) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        icon: "",
        color: "from-blue-500 to-cyan-400",
        description: "",
        features: "[]"
    });

    const handleEdit = (svc: Service) => {
        setEditingId(svc.id);
        const parsedFeatures = (() => {
            try { return JSON.parse(svc.features).join(", "); }
            catch { return svc.features; }
        })();

        setFormData({
            title: svc.title,
            icon: svc.icon,
            color: svc.color,
            description: svc.description,
            features: parsedFeatures
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: "", icon: "", color: "from-blue-500 to-cyan-400", description: "", features: "[]" });
    };

    return (
        <div className="space-y-10">
            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingId ? "Edit Capability" : "Add New Capability"}
                    </h2>
                    {editingId && (
                        <button onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form action={async (formData) => {
                    // Pre-process features list back to JSON
                    const rawFeatures = formData.get("features") as string;
                    const featuresArray = rawFeatures.split(',').map(s => s.trim()).filter(Boolean);
                    formData.set("features", JSON.stringify(featuresArray));

                    if (editingId) {
                        await updateService(editingId, formData);
                        handleCancelEdit();
                    } else {
                        await createService(formData);
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
                                placeholder="e.g. Network Audit"
                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Icon</label>
                            <div className="flex gap-2 mb-2">
                                <select
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-sm"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            setFormData({ ...formData, icon: e.target.value });
                                        }
                                    }}
                                    value="" // Always stay on "placeholder" so selecting same item works again if cleared
                                >
                                    <option value="">✨ Quick Select Icon...</option>
                                    <optgroup label="Microsoft">
                                        <option value="DynamicsNavIcon">Dynamics NAV</option>
                                        <option value="Microsoft365Icon">Microsoft 365</option>
                                    </optgroup>
                                    <optgroup label="Standard Icons">
                                        <option value="ShieldCheckIcon">Shield / Security</option>
                                        <option value="BoltIcon">Bolt / Optimization</option>
                                        <option value="ArrowPathIcon">Refresh / Recovery</option>
                                        <option value="ServerStackIcon">Server / Infrastructure</option>
                                        <option value="CodeBracketIcon">Code / Dev</option>
                                        <option value="CpuChipIcon">Chip / Hardware</option>
                                        <option value="CloudIcon">Cloud</option>
                                        <option value="LockClosedIcon">Lock</option>
                                        <option value="CommandLineIcon">Terminal</option>
                                    </optgroup>
                                    <optgroup label="Common Emojis">
                                        <option value="🛡️">🛡️ Shield</option>
                                        <option value="🚀">🚀 Rocket</option>
                                        <option value="💾">💾 Floppy</option>
                                        <option value="🏗️">🏗️ Building</option>
                                        <option value="💻">💻 Laptop</option>
                                        <option value="☁️">☁️ Cloud</option>
                                    </optgroup>
                                </select>
                            </div>
                            <input
                                name="icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                required
                                placeholder="Selected Icon Code or Custom Emoji"
                                className="mt-1 w-full px-4 py-2 border rounded-lg font-mono text-sm bg-gray-50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Color (Gradient Classes)</label>
                        <input
                            name="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            placeholder="e.g. from-blue-500 to-cyan-400"
                            className="mt-1 w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={3}
                            placeholder="Description..."
                            className="mt-1 w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Features (Comma separated)</label>
                        <textarea
                            name="features"
                            value={formData.features}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                            required
                            rows={2}
                            placeholder="Feature 1, Feature 2, Feature 3"
                            className="mt-1 w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <button type="submit" className={`text-white px-6 py-2 rounded-lg font-medium transition-colors ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {editingId ? "Update Capability" : "Add Capability"}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initialServices.map((svc) => (
                    <div key={svc.id} className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-3xl">{svc.icon}</span>
                                <h3 className="font-bold text-lg text-gray-900">{svc.title}</h3>
                            </div>
                            <p className="text-gray-600 mb-4 text-sm">{svc.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                    try {
                                        return JSON.parse(svc.features).map((f: string, i: number) => (
                                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">{f}</span>
                                        ));
                                    } catch { return null; }
                                })()}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6 justify-end">
                            <button
                                onClick={() => handleEdit(svc)}
                                className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded text-sm hover:bg-blue-50 transition-colors"
                            >
                                Edit
                            </button>
                            <form action={async () => {
                                if (confirm("Are you sure?")) {
                                    await deleteService(svc.id);
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
