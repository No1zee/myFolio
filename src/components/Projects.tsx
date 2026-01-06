"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import ProjectModal from './ProjectModal';
import { useMissionStore } from '@/lib/store';


const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};


type Project = {
    id: string;
    title: string;
    description: string;
    tags: string; // CSV or string
    imageUrl: string | null; // Color
}

const Projects = ({ projects }: { projects: Project[] }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { completeTask } = useMissionStore(); // Get completeTask

    const handleOpenModal = (project: Project) => {
        setSelectedProject(project);
        completeTask('viewedProject'); // Track mission
    };

    return (
        <section id="projects" className="py-32 px-6 relative z-10">
            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />

            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-sm font-bold tracking-[0.2em] text-brand-primary uppercase mb-6 border-b-2 border-brand-primary/30 pb-2"
                    >
                        CHAPTER II: THE PROOF
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-white"
                    >
                        Selected Case Studies
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        Deployments where critical infrastructure was secured, optimized, and scaled.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {projects.map((project, index) => {
                        return (
                            <motion.div key={project.id} variants={item}>
                                <ProjectCard
                                    project={{ ...project, tags: project.tags }}
                                    index={index}
                                    onOpenModal={() => handleOpenModal(project)}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Forward Nudge */}
                <div className="mt-24 flex justify-end">
                    <a href="#certifications" className="group flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors">
                        <span>Next: Certifications</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};


export default Projects;
