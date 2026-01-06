
import ResumeImporter from '@/components/admin/ResumeImporter';

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Mission Control</h2>

            <ResumeImporter />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50 pointer-events-none grayscale">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700">Experiences</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">Manage</p>
                    <p className="text-gray-500 text-sm mt-1">Manual edits disabled</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700">Skills</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">Manage</p>
                    <p className="text-gray-500 text-sm mt-1">Manual edits disabled</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700">Projects</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">Manage</p>
                    <p className="text-gray-500 text-sm mt-1">Manual edits disabled</p>
                </div>
            </div>
        </div>
    );
}
