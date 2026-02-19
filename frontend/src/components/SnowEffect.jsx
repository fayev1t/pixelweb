import React, { useMemo } from 'react';
import './SnowEffect.css';

const SnowEffect = ({ mode, isSheltered }) => {
    // Determine target mode and if active
    // Active false for now as PIXI handles all snow modes better (pixel art style)
    const isActive = false;
    const isFlurry = mode === 'flurry';

    // Always render roughly max flakes to avoid re-creating arrays constantly.
    // We can control density via CSS or just have a set amount that works for both.
    // Let's use a count that works well for Heavy snow, and maybe hide some for Flurry if needed?
    // Actually, simply changing the opacity/speed via CSS or re-calculating on mode change is fine 
    // since react uses diffing. But to be safe for transitions, let's keep the array stable-ish.

    // However, if we change the array length, React will re-mount the divs. 
    // To support smooth transitions between Flurry and Snow, we should probably keep the array max size
    // and just change properties or classes.

    const flakeCount = 220; // Max for heavy snow

    const flakes = useMemo(() => Array.from({ length: flakeCount }).map((_, i) => {
        // Randomize initial properties
        // We'll use CSS variables or classes to adjust speed based on mode if possible, 
        // or just accept that changing mode might re-trigger animations if we rely on JS props.
        // Re-triggering animation on mode change (Flurry <-> Snow) is probably acceptable.
        // The main goal is Smooth fading In/Out when turning ON/OFF.

        return {
            id: i,
            left: Math.random() * 110 - 5,
            size: 3 + Math.floor(Math.random() * 5), // 3-8px (larger flakes)
            duration: 4 + Math.random() * 6, // 4-10s base duration
            delay: -(Math.random() * 10), // Start at random times
            opacity: 0.5 + Math.random() * 0.5, // More visible
            drift: Math.round((Math.random() - 0.5) * 100),
        };
    }), []);

    const isSnow = mode === 'snow';

    // Character snow hits (gentle contact)
    const charSnow = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: `char-snow-${i}`,
        // Align with RainEffect: 51.5 - 53.5% (approx character width)
        left: 51.5 + Math.random() * 2.0,
        // Character bottom is 20-30%
        bottom: 20 + Math.random() * 10,
        delay: Math.random() * 2,
        // Slide duration: 1.5s - 2.5s
        duration: 1.5 + Math.random() * 1.0,
        // Visible size: 2px - 4px
        size: 2 + Math.random() * 2,
        driftX: (Math.random() - 0.5) * 5
    })), []);

    return (
        <div className={`snow-scene ${isActive ? 'active' : ''} ${mode}`}>
            <div className="snowflakes-layer">
                {flakes.map((flake) => (
                    <div
                        key={flake.id}
                        className="snowflake"
                        style={{
                            left: `${flake.left}%`,
                            width: `${flake.size}px`,
                            height: `${flake.size}px`,
                            // Blizzard: significantly faster and more drift
                            animationDuration: isSnow ? `${flake.duration * 0.15}s` : `${flake.duration}s`,
                            animationDelay: `${flake.delay}s`,
                            opacity: flake.opacity,
                            '--drift': isSnow ? `${flake.drift * 8}px` : `${flake.drift}px`
                        }}
                    />
                ))}
                {/* Character Snow - gentle contact */}
                {!isSheltered && charSnow.map((snow) => (
                    <div
                        key={snow.id}
                        className="snowflake char-snow"
                        style={{
                            left: `${snow.left}%`,
                            bottom: `${snow.bottom}%`,
                            width: `${snow.size}px`,
                            height: `${snow.size}px`,
                            animationDelay: `${snow.delay}s`,
                            animationDuration: `${snow.duration}s`,
                            '--drift-x': `${snow.driftX}px`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SnowEffect;
