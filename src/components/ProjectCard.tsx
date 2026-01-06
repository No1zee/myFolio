import React from 'react';
import { motion } from 'framer-motion';
import StarCard from './StarCard';
import { Badge } from './Badge';

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string;
    imageUrl: string | null;
}

interface ProjectCardProps {
    project: Project;
    index: number;
    onOpenModal: () => void;
}

export const ProjectCard = ({ project, index, onOpenModal }: ProjectCardProps) => {
    let tech: string[] = [];
    try {
        tech = JSON.parse(project.tags);
    } catch {
        tech = project.tags.split(',').map(t => t.trim());
    }

    return (
        <StarCard
            layout={false} // Disable layout animation just in case
            initial={{ opacity: 1, y: 0 }} // Override StarCard default
            whileInView={{ opacity: 1, y: 0 }} // Override StarCard default
            viewport={{}} // Override
            onClick={onOpenModal}
            className="flex flex-col h-full cursor-pointer group"
        >
            <div className="p-8 flex flex-col h-full relative z-10">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-primary transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                        {project.description}
                    </p>
                </div>

                <div className="h-24 w-full mb-6 rounded-lg bg-gradient-to-r from-brand-surface-alt to-gray-800 relative overflow-hidden group-hover:from-brand-primary/20 group-hover:to-brand-primary/10 transition-colors">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                    {/* Simulated Sparkline */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 flex items-end gap-1 px-4 pb-2 opacity-50">
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} style={{ height: `${h}% ` }} className="flex-1 bg-brand-primary rounded-t-sm"></div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tech.slice(0, 3).map((t, i) => (
                            <Badge key={i} variant="primary">
                                {t}
                            </Badge>
                        ))}
                    </div>

                    <motion.div
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors"
                    >
                        View Details <span className="text-brand-primary">→</span>
                    </motion.div>
                </div>

                {/* Metric Badge */}
                <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <span className="bg-brand-success/10 text-brand-success border border-brand-success/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Success Rate: 100%
                    </span>
                </div>
            </div>
        </StarCard>
    );
};
