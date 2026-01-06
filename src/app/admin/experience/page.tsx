
import { getExperiences } from "@/app/actions/portfolio";
import ExperienceManager from "./ExperienceManager";

export const dynamic = 'force-dynamic';

export default async function AdminExperiencePage() {
    const experiences = await getExperiences();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Experience</h1>
                <p className="text-gray-500">Add, edit, or remove your professional history.</p>
            </div>

            <ExperienceManager initialExperiences={experiences} />
        </div>
    );
}
