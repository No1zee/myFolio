
import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Admin CMS</h1>
                    <p className="text-gray-400 text-sm">Manage Portfolio</p>
                </div>
                <nav className="mt-6">
                    <Link href="/admin" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/admin/experience" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
                        Experience
                    </Link>
                    <Link href="/admin/skills" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
                        Skills
                    </Link>
                    <Link href="/admin/services" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
                        Capabilities (Services)
                    </Link>
                    <Link href="/admin/projects" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
                        Achievements (Projects)
                    </Link>
                    <Link href="/admin/certifications" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
                        Certifications (Expertise)
                    </Link>
                    <Link href="/admin/journal" className="block px-6 py-3 hover:bg-gray-800 transition-colors">
                        Captain's Log (Journal)
                    </Link>
                    <Link href="/" className="block px-6 py-3 mt-10 hover:bg-gray-800 text-blue-400">
                        View Live Site &rarr;
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-10">
                {children}
            </main>
        </div>
    );
}
