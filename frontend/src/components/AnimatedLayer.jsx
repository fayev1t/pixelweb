import React, { useEffect, useMemo, useRef } from 'react';

const AnimatedLayer = ({ imagesMap, fps = 12, className, style, children }) => {
    // Sort images by key to ensure order
    const imageUrls = useMemo(() => {
        return Object.keys(imagesMap).sort((a, b) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
        }).map(key => imagesMap[key]);
    }, [imagesMap]);

    const divRef = useRef(null);
    const frameIndexRef = useRef(0);
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const preloadedImagesRef = useRef([]);

    // Preload images
    useEffect(() => {
        preloadedImagesRef.current = [];
        const images = [];

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            // Attempt to decode to ensure no junk on first render
            if (img.decode) {
                img.decode().catch(() => { });
            }
            images.push(img);
        });

        preloadedImagesRef.current = images;
        frameIndexRef.current = 0;
        previousTimeRef.current = undefined;

        // Set initial frame
        if (divRef.current && imageUrls.length > 0) {
            divRef.current.style.backgroundImage = `url(${imageUrls[0]})`;
        }
    }, [imageUrls]);

    // Animation Loop
    useEffect(() => {
        if (imageUrls.length <= 1) return;

        const interval = 1000 / fps;

        // Reset timing when FPS or images change to provide smooth restart
        previousTimeRef.current = undefined;

        const animate = (time) => {
            if (previousTimeRef.current === undefined) {
                previousTimeRef.current = time;
            }

            const deltaTime = time - previousTimeRef.current;

            if (deltaTime >= interval) {
                frameIndexRef.current = (frameIndexRef.current + 1) % imageUrls.length;
                previousTimeRef.current = time - (deltaTime % interval);

                if (divRef.current) {
                    divRef.current.style.backgroundImage = `url(${imageUrls[frameIndexRef.current]})`;
                }
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [imageUrls.length, fps]);

    return (
        <div
            className={className}
            style={{ ...style }} // Outer: React controls Opacity, Z-Index, Position
        >
            <div
                ref={divRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'auto 100%',
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'repeat-x',
                    imageRendering: 'pixelated',
                }}
            />
            {children}
        </div>
    );
};

export default AnimatedLayer;
