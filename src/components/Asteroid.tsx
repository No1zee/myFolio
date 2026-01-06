"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// --- CONFIGURATION ---
const ASTEROID_COUNT = 20;

interface AsteroidEntity {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    size: number;
    mass: number; // New Property
}

const Asteroids = () => {
    const [asteroids, setAsteroids] = useState<AsteroidEntity[]>([]);
    const animationRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- INITIALIZATION ---
    useEffect(() => {
        const initialAsteroids: AsteroidEntity[] = [];

        for (let i = 0; i < ASTEROID_COUNT; i++) {
            let attempts = 0;
            let valid = false;
            let asteroid: AsteroidEntity | null = null;

            while (!valid && attempts < 50) {
                const isSmall = Math.random() > 0.3;
                const size = isSmall ? 10 + Math.random() * 15 : 25 + Math.random() * 35;
                const x = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000);
                const y = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000);

                // Check overlap with existing
                let overlap = false;
                for (const other of initialAsteroids) {
                    const dx = (x + size / 2) - (other.x + other.size / 2);
                    const dy = (y + size / 2) - (other.y + other.size / 2);
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = (size / 2) + (other.size / 2);
                    if (dist < minDist + 10) { // +10px buffer
                        overlap = true;
                        break;
                    }
                }

                if (!overlap) {
                    // Smaller size -> Higher speed
                    const speedMultiplier = 1 + (60 - size) / 8;
                    asteroid = {
                        id: i,
                        x, y,
                        vx: (Math.random() - 0.5) * speedMultiplier,
                        vy: (Math.random() - 0.5) * speedMultiplier,
                        rotation: Math.random() * 360,
                        rotationSpeed: (Math.random() - 0.5) * 2,
                        size,
                        mass: size * size
                    };
                    valid = true;
                }
                attempts++;
            }

            // Fallback if no spot found (unlikely)
            if (!asteroid) {
                const size = 15;
                asteroid = {
                    id: i,
                    x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
                    rotation: 0, rotationSpeed: 1, size: 15, mass: 225
                };
            }
            initialAsteroids.push(asteroid);
        }
        setAsteroids(initialAsteroids);
    }, []);

    // --- PHYSICS LOOP ---
    useEffect(() => {
        const update = () => {
            if (!containerRef.current) return;
            const { innerWidth, innerHeight } = window;

            setAsteroids(prev => {
                const next = prev.map(a => ({ ...a })); // Clone

                // 1. Move & Wall Bounce
                for (const ast of next) {
                    ast.x += ast.vx;
                    ast.y += ast.vy;
                    ast.rotation += ast.rotationSpeed;

                    if (ast.x <= 0 || ast.x + ast.size >= innerWidth) {
                        ast.vx *= -1;
                        ast.x = Math.max(0, Math.min(ast.x, innerWidth - ast.size));
                    }
                    if (ast.y <= 0 || ast.y + ast.size >= innerHeight) {
                        ast.vy *= -1;
                        ast.y = Math.max(0, Math.min(ast.y, innerHeight - ast.size));
                    }
                }

                // 2. Advanced Collision (Elastic 2D)
                for (let i = 0; i < next.length; i++) {
                    const a = next[i];
                    for (let j = i + 1; j < next.length; j++) {
                        const b = next[j];

                        const dx = (a.x + a.size / 2) - (b.x + b.size / 2);
                        const dy = (a.y + a.size / 2) - (b.y + b.size / 2);
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const minDist = (a.size / 2) + (b.size / 2);

                        if (dist < minDist) {
                            // --- Resolve Overlap (Prevent Sticking) ---
                            const angle = Math.atan2(dy, dx);
                            const overlap = minDist - dist;
                            // Move based on inverse mass? Or just equal for stability? 
                            // Equal separation is more stable for preventing jitters.
                            const move = overlap / 2;
                            a.x += Math.cos(angle) * move;
                            a.y += Math.sin(angle) * move;
                            b.x -= Math.cos(angle) * move;
                            b.y -= Math.sin(angle) * move;

                            // --- Elastic Collision Physics ---
                            const nx = dx / dist; // Normal X
                            const ny = dy / dist; // Normal Y

                            // Relative Velocity
                            const dvx = a.vx - b.vx;
                            const dvy = a.vy - b.vy;

                            // Velocity along normal
                            const vn = dvx * nx + dvy * ny;

                            // Do not resolve if moving away
                            if (vn > 0) continue;

                            // Collision Impulse
                            // J = -(1 + e) * vn / (1/m1 + 1/m2)
                            // e = coefficient of restitution (1 = perfectly elastic)
                            const e = 1.0;
                            const impulse = -(1 + e) * vn / ((1 / a.mass) + (1 / b.mass));

                            // Apply Impulse
                            const ix = impulse * nx;
                            const iy = impulse * ny;

                            a.vx += ix / a.mass;
                            a.vy += iy / a.mass;
                            b.vx -= ix / b.mass;
                            b.vy -= iy / b.mass;
                        }
                    }
                }
                return next;
            });

            animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {asteroids.map(ast => (
                <motion.div
                    key={ast.id}
                    className="absolute mix-blend-screen filter blur-[0.5px] opacity-20"
                    style={{
                        left: ast.x,
                        top: ast.y,
                        width: ast.size,
                        height: ast.size,
                        rotate: ast.rotation,
                        zIndex: 10, // "Same Ground" - Fixed Z-Index for all
                    }}
                    transition={{ duration: 0 }}
                >
                    <img src="/asteroid_white.png" className="w-full h-full object-contain" alt="Asteroid" />
                </motion.div>
            ))}
        </div>
    );
};

export default Asteroids;
