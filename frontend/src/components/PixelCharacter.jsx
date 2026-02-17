import React, { useState, useEffect } from 'react';

/**
 * PixelCharacter Component
 * Renders a layered pixel character from spritesheets.
 * Supports different orientations and animations.
 */
const PixelCharacter = ({
    layers = [],
    orientation = 0,
    fps = 8,
    scale = 4,
    className = "",
    style = {}
}) => {
    const [frameIndex, setFrameIndex] = useState(0);
    const frameCount = 10;
    const frameSize = 24;

    useEffect(() => {
        const interval = setInterval(() => {
            setFrameIndex((prev) => (prev + 1) % frameCount);
        }, 1000 / fps);
        return () => clearInterval(interval);
    }, [fps]);

    // Base style for each layer part
    const layerBaseStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundSize: `${100 * frameCount}% ${100 * 4}%`, // 10 columns, 4 rows
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        // backgroundPosition: x% y%
        // x = (frameIndex / (frameCount - 1)) * 100%
        // y = (orientation / (4 - 1)) * 100%
        // But with backgroundPosition, it's safer to use pixels if we know the size
        backgroundPosition: `-${frameIndex * frameSize * scale}px -${orientation * frameSize * scale}px`,
    };

    return (
        <div
            className={`pixel-character ${className}`}
            style={{
                position: 'relative',
                width: frameSize * scale,
                height: frameSize * scale,
                ...style
            }}
        >
            {layers.map((layer, idx) => {
                const isObject = typeof layer === 'object' && layer !== null;
                const url = isObject ? layer.url : layer;
                const customStyle = isObject ? layer.style : {};

                return (
                    <div
                        key={idx}
                        style={{
                            ...layerBaseStyle,
                            backgroundImage: `url(${url})`,
                            zIndex: idx,
                            // Ensure background size matches the scale
                            backgroundSize: `${frameSize * frameCount * scale}px ${frameSize * 4 * scale}px`,
                            ...customStyle
                        }}
                    />
                );
            })}
        </div>
    );
};

export default PixelCharacter;
