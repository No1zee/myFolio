import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

async function getProject(id: string) {
    try {
        const project = await prisma.project.findUnique({
            where: { id },
        });
        return project;
    } catch (error) {
        return null;
    }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const project = await getProject(params.id);

    if (!project) {
        notFound();
    }

    const tags = (() => {
        try {
            return JSON.parse(project.tags);
        } catch {
            return project.tags.split(',').map((t: string) => t.trim());
        }
    })();

    return (
        <main className="min-h-screen bg-[#030712] text-white selection:bg-brand-primary/30 pb-20">
            {/* Header/Hero */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030712] z-10" />
                {project.imageUrl ? (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-50"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 opacity-50" />
                )}

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-20 max-w-6xl mx-auto w-full">
                    <Link
                        href="/#projects"
                        className="absolute top-10 left-6 sm:left-20 flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest font-bold"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Projects
                    </Link>

                    <div className="space-y-6 mb-10">
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-xs font-mono border border-brand-primary/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
                            {project.title}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                            {project.description}
                        </p>
                        <div className="flex gap-4 pt-4">
                            {project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noreferrer" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                                    View Live Demo
                                </a>
                            )}
                            {project.repoUrl && (
                                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="px-8 py-3 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                                    GitHub Repo
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <article className="max-w-4xl mx-auto px-6 sm:px-0 mt-12 sm:mt-20">
                {project.content ? (
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-400 prose-a:text-brand-primary prose-strong:text-white">
                        <ReactMarkdown>{project.content}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="text-center py-20 border border-gray-800 rounded-3xl bg-gray-900/50">
                        <p className="text-gray-500 italic">No detailed case study available yet.</p>
                    </div>
                )}
            </article>
        </main>
    );
}
