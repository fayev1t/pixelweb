import React, { useMemo } from 'react';
import './SnowEffect.css';

const SnowEffect = ({ active }) => {
    if (!active) return null;

    const flakeCount = 220;

    const flakes = useMemo(() => Array.from({ length: flakeCount }).map((_, i) => {
        const size = 2 + Math.floor(Math.random() * 3);
        const duration = 6 + Math.random() * 6;
        return {
            id: i,
            left: Math.random() * 110 - 5,
            size,
            duration,
            delay: -Math.random() * duration,
            opacity: 0.5 + Math.random() * 0.5,
            drift: Math.round((Math.random() - 0.5) * 80)
        };
    }), [flakeCount]);

    return (
        <div className="snow-scene">
            <div className="snowflakes-layer">
                {flakes.map((flake) => (
                    <div
                        key={flake.id}
                        className="snowflake"
                        style={{
                            left: `${flake.left}%`,
                            width: `${flake.size}px`,
                            height: `${flake.size}px`,
                            opacity: flake.opacity,
                            animationDuration: `${flake.duration}s`,
                            animationDelay: `${flake.delay}s`,
                            '--drift': `${flake.drift}px`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SnowEffect;
