"use client";

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// --- CONFIGURATION ---
const BUTTERFLY_COUNT = 8;
const SPRITE_STEPS = 6;

// --- TYPES ---
interface Butterfly {
    id: number;
    x: number;
    y: number;
    z: number; // -100 (far back) to 100 (close foreground)
    targetX: number;
    targetY: number;
    targetZ: number;
    speed: number;
}

const Mascot = () => {
    const [butterflies, setButterflies] = useState<Butterfly[]>([]);

    // --- INITIALIZATION ---
    useEffect(() => {
        // Create initial flock with random positions
        const initialFlock = Array.from({ length: BUTTERFLY_COUNT }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            z: Math.random() * 200 - 100, // -100 to 100
            targetX: Math.random() * 100,
            targetY: Math.random() * 100,
            targetZ: Math.random() * 200 - 100,
            speed: 0.2 + Math.random() * 0.3
        }));
        setButterflies(initialFlock);
    }, []);

    // --- FLOCKING LOGIC LOOP ---
    useEffect(() => {
        let animationFrameId: number;

        const updatePositions = () => {
            setButterflies(prevButterflies => prevButterflies.map(b => {
                // Move towards target
                const dx = b.targetX - b.x;
                const dy = b.targetY - b.y;
                const dz = b.targetZ - b.z;

                // If close to target, pick new random target
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 5) {
                    return {
                        ...b,
                        targetX: Math.random() * 100,
                        targetY: Math.random() * 100,
                        targetZ: Math.random() * 200 - 100,
                    };
                }

                // Smooth movement
                return {
                    ...b,
                    x: b.x + dx * (b.speed * 0.05), // Damping
                    y: b.y + dy * (b.speed * 0.05),
                    z: b.z + dz * (b.speed * 0.05)
                };
            }));

            animationFrameId = requestAnimationFrame(updatePositions);
        };

        animationFrameId = requestAnimationFrame(updatePositions);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {butterflies.map((b) => {
                // --- RENDER LOGIC BASED ON Z-DEPTH ---

                // Deep Background (Z < -50): High Blur, Low Opacity, Small
                // Mid (Z -50 to 50): Light Blur, Normal Opacity
                // Foreground (Z > 50): No Blur, High Opacity, Large

                let blur = 0;
                let opacity = 1;
                let scale = 1;
                let zIndex = 0;

                if (b.z < -50) {
                    // Background
                    blur = 4;
                    opacity = 0.4;
                    scale = 0.5;
                    zIndex = -10;
                } else if (b.z > 50) {
                    // Foreground
                    blur = 0;
                    opacity = 1;
                    scale = 1.5;
                    zIndex = 50;
                } else {
                    // Mid
                    blur = 1;
                    opacity = 0.8;
                    scale = 1.0;
                    zIndex = 0;
                }

                return (
                    <motion.div
                        key={b.id}
                        className="absolute w-24 h-24 mix-blend-multiply"
                        style={{
                            left: `${b.x}%`,
                            top: `${b.y}%`,
                            filter: `blur(${blur}px)`,
                            opacity: opacity,
                            scale: scale,
                            zIndex: zIndex,
                        }}
                        transition={{ ease: "linear", duration: 0 }} // Corrects React updates
                    >
                        {/* ROTATION & FLAPPING */}
                        <div
                            className="w-full h-full bg-[url('/butterfly_blue_white.png')] bg-no-repeat bg-cover"
                            style={{
                                backgroundSize: `${SPRITE_STEPS * 100}% 100%`,
                                transform: `rotate(${b.targetX - b.x > 0 ? 15 : -15}deg)` // Tilt into turn
                            }}
                        >
                            <style jsx>{`
                                @keyframes flap {
                                    from { background-position: 0 0; }
                                    to { background-position: 100% 0; }
                                }
                                div {
                                    animation: flap 0.6s steps(${SPRITE_STEPS}) infinite;
                                }
                            `}</style>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default Mascot;
