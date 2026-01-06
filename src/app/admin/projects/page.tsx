
import { getProjects } from "@/app/actions/portfolio";
import ProjectManager from "./ProjectManager";

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
    const projects = await getProjects();
    return <ProjectManager initialProjects={projects} />;
}
