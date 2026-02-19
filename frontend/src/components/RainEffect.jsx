import React, { useMemo, useEffect, useState } from 'react';
import './RainEffect.css';

const RainEffect = ({ mode, isSheltered }) => {
    // Keep track if we should show rain (light or heavy)
    // We render always, but toggle a class for opacity transition
    const isActive = mode === 'light' || mode === 'heavy';
    const isHeavy = mode === 'heavy';



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

    // Character splashes (on head/shoulders) -> Positioned carefully around character at left 52%, bottom ~20-28%
    const charSplashes = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: `char-splash-${i}`,
        // Character center is 52%. Width is small. Range 51.5% - 52.5%
        left: 51.5 + Math.random() * 1.5,
        // Character bottom is 19.5%. Height approx ~10%. Range 20% - 28%
        bottom: 20 + Math.random() * 8,
        delay: Math.random() * 2,
        duration: 0.1 + Math.random() * 0.2, // Very fast flashes
        scale: 0.8 + Math.random() * 0.4
    })), []);

    return (
        <div className={`rain-scene ${isActive ? 'active' : ''} ${mode}`}>
            <div className="drops-layer">
                {drops.map((drop, index) => (
                    <div
                        key={drop.id}
                        className={`rain-drop ${index >= 200 ? 'heavy-only' : ''}`}
                        style={{
                            left: `${drop.left}%`,
                            animationDuration: `${drop.duration}s`,
                            animationDelay: `${drop.delay}s`,
                            '--drop-opacity': drop.opacity,
                            '--fall-y': drop.fallY,
                            '--fall-x': drop.fallX
                        }}
                    />
                ))}
            </div>

            <div className="splashes-layer">
                {splashes.map((splash, index) => (
                    <div
                        key={splash.id}
                        className={`rain-splash ${index >= 30 ? 'heavy-only' : ''}`}
                        style={{
                            left: `${splash.left}%`,
                            bottom: `${splash.bottom}%`,
                            animationDelay: `${splash.delay}s`,
                            animationDuration: `${splash.duration}s`,
                            transform: `scale(${splash.scale})`
                        }}
                    />
                ))}
                {/* Character Splashes - subtle impacts on the character */}
                {!isSheltered && charSplashes.map((splash, index) => (
                    <div
                        key={splash.id}
                        className={`rain-splash char-splash ${index >= 5 ? 'heavy-only' : ''}`}
                        style={{
                            left: `${splash.left}%`,
                            bottom: `${splash.bottom}%`,
                            animationDelay: `${splash.delay}s`,
                            transform: `scale(${splash.scale})`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default RainEffect;
