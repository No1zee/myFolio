"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// --- CONFIGURATION ---
const ASTEROID_COUNT = 12; // Reduced for performance
const FPS_LIMIT = 30;
const FRAME_INTERVAL = 1000 / FPS_LIMIT;

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

    const collidersRef = useRef<DOMRect[]>([]);

    // --- DOM COLLISION SETUP ---
    useEffect(() => {
        const updateColliders = () => {
            const elements = document.querySelectorAll('.gravity-repulse');
            const rects = Array.from(elements).map(el => el.getBoundingClientRect());
            collidersRef.current = rects;
        };

        // Update periodically and on scroll/resize
        updateColliders();
        const interval = setInterval(updateColliders, 2000); // Check for new elements every 2s
        window.addEventListener('resize', updateColliders);
        window.addEventListener('scroll', updateColliders, { passive: true });

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', updateColliders);
            window.removeEventListener('scroll', updateColliders);
        };
    }, []);

    // --- PHYSICS LOOP ---
    useEffect(() => {
        let lastTime = 0;
        const update = (time: number) => {
            if (!containerRef.current) return;

            const deltaTime = time - lastTime;
            if (deltaTime < FRAME_INTERVAL) {
                animationRef.current = requestAnimationFrame(update);
                return;
            }
            lastTime = time - (deltaTime % FRAME_INTERVAL);

            const { innerWidth, innerHeight } = window;
            const colliders = collidersRef.current; // Read cached colliders

            setAsteroids(prev => {
                const next = prev.map(a => ({ ...a })); // Clone

                // 1. Move & Wall Bounce
                for (const ast of next) {
                    ast.x += ast.vx;
                    ast.y += ast.vy;
                    ast.rotation += ast.rotationSpeed;

                    // Wall Bounce
                    if (ast.x <= 0) { ast.vx = Math.abs(ast.vx); ast.x = 0; }
                    if (ast.x + ast.size >= innerWidth) { ast.vx = -Math.abs(ast.vx); ast.x = innerWidth - ast.size; }
                    if (ast.y <= 0) { ast.vy = Math.abs(ast.vy); ast.y = 0; }
                    if (ast.y + ast.size >= innerHeight) { ast.vy = -Math.abs(ast.vy); ast.y = innerHeight - ast.size; }

                    // DOM Element Collision
                    const cx = ast.x + ast.size / 2;
                    const cy = ast.y + ast.size / 2;
                    const r = ast.size / 2;

                    for (const rect of colliders) {
                        // Find closest point on rect to circle center
                        const testX = Math.max(rect.left, Math.min(cx, rect.right));
                        const testY = Math.max(rect.top, Math.min(cy, rect.bottom));

                        const dx = cx - testX;
                        const dy = cy - testY;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < r) {
                            // Collision detected! Resolve...
                            const overlap = r - dist;

                            // Normalize impact vector
                            let nx = dx / dist;
                            let ny = dy / dist;

                            // Fallback if center is exactly inside (dist is 0)
                            if (dist === 0) { nx = 1; ny = 0; }

                            // Move out of collision
                            ast.x += nx * overlap;
                            ast.y += ny * overlap;

                            // Reflection (Standard bounce)
                            const dot = ast.vx * nx + ast.vy * ny;
                            ast.vx = (ast.vx - 2 * dot * nx) * 0.9; // 0.9 = slight energy loss
                            ast.vy = (ast.vy - 2 * dot * ny) * 0.9;

                            // Spin it
                            ast.rotationSpeed += (Math.random() - 0.5) * 5;
                        }
                    }
                }

                // 2. Asteroid-Asteroid Collision (Elastic 2D)
                for (let i = 0; i < next.length; i++) {
                    const a = next[i];
                    for (let j = i + 1; j < next.length; j++) {
                        const b = next[j];

                        const dx = (a.x + a.size / 2) - (b.x + b.size / 2);
                        const dy = (a.y + a.size / 2) - (b.y + b.size / 2);
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const minDist = (a.size / 2) + (b.size / 2);

                        if (dist < minDist) {
                            // Only resolve if actual overlap
                            const angle = Math.atan2(dy, dx);
                            const overlap = minDist - dist;
                            const move = overlap / 2;
                            a.x += Math.cos(angle) * move;
                            a.y += Math.sin(angle) * move;
                            b.x -= Math.cos(angle) * move;
                            b.y -= Math.sin(angle) * move;

                            const nx = dx / dist;
                            const ny = dy / dist;
                            const dvx = a.vx - b.vx;
                            const dvy = a.vy - b.vy;
                            const vn = dvx * nx + dvy * ny;

                            if (vn > 0) continue; // Moving away

                            const e = 1.0;
                            const impulse = -(1 + e) * vn / ((1 / a.mass) + (1 / b.mass));
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
