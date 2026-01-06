"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion";

interface StarCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const StarCard = ({ children, className = "", onClick, ...props }: StarCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for tilt
    const mouseX = useSpring(x, { stiffness: 500, damping: 90 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 90 });

    // Tilt transforms
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["2deg", "-2deg"]); // Inverted for natural feel
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-2deg", "2deg"]);

    // Internal Stars Parallax (Reverse movement for depth)
    const starX = useTransform(mouseX, [-0.5, 0.5], ["3px", "-3px"]);
    const starY = useTransform(mouseY, [-0.5, 0.5], ["3px", "-3px"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const clientX = e.clientX - rect.left; // 0 to width
        const clientY = e.clientY - rect.top; // 0 to height

        // Normalize to -0.5 to 0.5
        const normalizedX = (clientX / width) - 0.5;
        const normalizedY = (clientY / height) - 0.5;

        x.set(normalizedX);
        y.set(normalizedY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Generate stable random stars (using fixed seed concept or just constant for now)
    const stars = [
        { top: "15%", left: "10%", delay: 0 },
        { top: "75%", left: "85%", delay: 1.5 },
        { top: "20%", left: "90%", delay: 0.8 },
        { top: "80%", left: "15%", delay: 2.2 },
    ];

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            {...props}
            className={`relative group perspective-1000 ${className}`}
        >
            <div className="relative h-full w-full transform-style-3d overflow-hidden rounded-xl bg-brand-surface border border-gray-800 transition-colors duration-300 group-hover:border-brand-primary/50 group-hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)]">

                {/* PARALLAX STARS BACKGROUND */}
                <motion.div
                    style={{ x: starX, y: starY }}
                    className="absolute inset-0 pointer-events-none z-0"
                >
                    {stars.map((star, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-0"
                            style={{ top: star.top, left: star.left }}
                            animate={{
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: star.delay,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </motion.div>

                {/* GLINT EFFECT */}
                <motion.div
                    className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                >
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine" />
                </motion.div>

                {/* CONTENT */}
                <div className="relative z-20 h-full">
                    {children}
                </div>

            </div>
        </motion.div>
    );
};

export default StarCard;
