import React, { useMemo, useEffect, useState } from 'react';
import './RainEffect.css';

const RainEffect = ({ mode }) => {
    // Keep track if we should show rain (light or heavy)
    // We render always, but toggle a class for opacity transition
    const isActive = mode === 'light' || mode === 'heavy';
    const isHeavy = mode === 'heavy';

    // We only update drops/splashes when mode changes significantly between light/heavy
    // or when first mounting.

    const dropCount = isHeavy ? 400 : 200;
    const splashCount = isHeavy ? 60 : 30;

    const drops = useMemo(() => Array.from({ length: 400 }).map((_, i) => {
        // Feature: Depth-based culling
        // 50% hit the Hills (Background) -> stop around 40-50vh
        // 40% hit the Grass (Midground) -> stop around 70-80vh (90% cumulative)
        // 10% fall to bottom (Foreground) -> stop >100vh
        const rand = Math.random();
        let fallYVal;
        let opacity;

        if (rand < 0.5) {
            // Background (Hills)
            fallYVal = 40 + Math.random() * 10;
            opacity = 0.4 + Math.random() * 0.2;
        } else if (rand < 0.9) {
            // Midground (Grass)
            fallYVal = 70 + Math.random() * 10;
            opacity = 0.7 + Math.random() * 0.2;
        } else {
            // Foreground (Ground)
            fallYVal = 100 + Math.random() * 20;
            opacity = 0.9 + Math.random() * 0.1;
        }

        const fallY = `${fallYVal}vh`;
        // Maintain slanted angle (~20deg)
        // Tan(20) ~ 0.36. If Y is 100vh (approx 800px), X is approx 290px.
        // Let's use a consistent multiplier relative to Y travel.
        const fallX = `${fallYVal * 2.5}px`;

        return {
            id: i,
            left: Math.random() * 120 - 20,
            duration: (0.5) + Math.random() * 0.3, // Slightly slower than the chaotic pixel blocks
            delay: Math.random() * 2,
            opacity,
            fallY,
            fallX
        };
    }), []); // Calculate once

    const splashes = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        bottom: 5 + Math.random() * 30,
        delay: Math.random() * 2,
        duration: 0.4 + Math.random() * 0.4,
        scale: 0.5 + Math.random() * 0.5
    })), []); // Calculate once

    return (
        <div className={`rain-scene ${isActive ? 'active' : ''} ${mode}`}>
            <div className="drops-layer">
                {drops.slice(0, dropCount).map((drop) => (
                    <div
                        key={drop.id}
                        className="rain-drop"
                        style={{
                            left: `${drop.left}%`,
                            animationDuration: `${isHeavy ? drop.duration : drop.duration * 1.5}s`,
                            animationDelay: `${drop.delay}s`,
                            '--drop-opacity': drop.opacity,
                            '--fall-y': drop.fallY,
                            '--fall-x': drop.fallX
                        }}
                    />
                ))}
            </div>

            <div className="splashes-layer">
                {splashes.slice(0, splashCount).map((splash) => (
                    <div
                        key={splash.id}
                        className="rain-splash"
                        style={{
                            left: `${splash.left}%`,
                            bottom: `${splash.bottom}%`,
                            animationDelay: `${splash.delay}s`,
                            animationDuration: `${splash.duration}s`,
                            transform: `scale(${splash.scale})`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default RainEffect;
