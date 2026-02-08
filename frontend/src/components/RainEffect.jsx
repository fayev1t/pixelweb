import React, { useMemo } from 'react';
import './RainEffect.css';

const RainEffect = ({ mode }) => {
    if (mode !== 'light' && mode !== 'heavy') return null;

    const dropCount = mode === 'heavy' ? 400 : 200;
    const splashCount = mode === 'heavy' ? 60 : 30;

    const drops = useMemo(() => Array.from({ length: dropCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 120 - 10,
        duration: (mode === 'heavy' ? 0.3 : 0.5) + Math.random() * 0.3,
        delay: Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.4
    })), [mode, dropCount]);

    const splashes = useMemo(() => Array.from({ length: splashCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        bottom: 5 + Math.random() * 30,
        delay: Math.random() * 2,
        duration: 0.4 + Math.random() * 0.4,
        scale: 0.5 + Math.random() * 0.5
    })), [mode, splashCount]);

    return (
        <div className={`rain-scene ${mode}`}>
            <div className="drops-layer">
                {drops.map((drop) => (
                    <div
                        key={drop.id}
                        className="rain-drop"
                        style={{
                            left: `${drop.left}%`,
                            animationDuration: `${drop.duration}s`,
                            animationDelay: `${drop.delay}s`,
                            opacity: drop.opacity
                        }}
                    />
                ))}
            </div>

            <div className="splashes-layer">
                {splashes.map((splash) => (
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
