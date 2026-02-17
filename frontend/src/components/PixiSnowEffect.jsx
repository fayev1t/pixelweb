import React, { useEffect, useRef } from 'react';
import './PixiSnowEffect.css';
import * as PIXI from 'pixi.js';

const PixiSnowEffect = ({ mode }) => {
    const containerRef = useRef(null);
    const appRef = useRef(null);
    const isFlurry = mode === 'flurry';
    const isSnow = mode === 'snow';
    const isActive = isFlurry || isSnow;
    const weatherStateRef = useRef({
        isActive: false,
        isFlurry: false,
        isSnow: false,
    });

    useEffect(() => {
        const containerEl = containerRef.current;
        if (!containerEl) return;

        let app;
        let snowflakes = [];
        let animationFrameId;
        let disposed = false;
        let destroyed = false;

        const destroyApp = () => {
            if (!app || destroyed) return;
            destroyed = true;
            try {
                // Guard against Pixi resize plugin throwing on repeated/unbalanced destroy in dev StrictMode.
                if (typeof app._cancelResize !== 'function') {
                    app._cancelResize = () => { };
                }
                app.destroy(true, { children: true, texture: true });
            } catch (error) {
                console.error('PixiSnowEffect destroy failed:', error);
            } finally {
                app = undefined;
                appRef.current = null;
                snowflakes = [];
            }
        };

        const initPixi = async () => {
            app = new PIXI.Application();
            try {
                await app.init({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    backgroundAlpha: 0,
                    antialias: false,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true,
                });

                if (disposed) {
                    destroyApp();
                    return;
                }

                containerEl.appendChild(app.canvas);
                appRef.current = app;

                const snowContainer = new PIXI.Container();
                app.stage.addChild(snowContainer);

                // Create max particles needed (increased for blizzard density)
                const maxSnowflakes = 2000;

                for (let i = 0; i < maxSnowflakes; i++) {
                    const snowflake = createSnowflake(app);
                    snowflakes.push(snowflake);
                    snowContainer.addChild(snowflake.sprite);
                }

                let lastTime = performance.now();

                const animate = (currentTime) => {
                    if (disposed) return;

                    const deltaTime = (currentTime - lastTime) / 1000;
                    lastTime = currentTime;

                    // Get current state from ref
                    const { isActive, isFlurry, isSnow } = weatherStateRef.current;

                    snowflakes.forEach((flake, index) => {
                        // Optimization: Hide flakes if index > limit for flurry
                        // Actually, let applyPixelMovement handle density culling.
                        // Here we just handle global fade in/out.
                        const isGlobalActive = isActive;

                        // Smoothly fade alpha based on global state
                        const targetAlpha = isGlobalActive ? (flake.baseAlpha * (0.84 + 0.16 * Math.sin(currentTime * 0.0018 + flake.phase))) : 0;

                        flake.currentAlpha = flake.currentAlpha !== undefined ? flake.currentAlpha : 0;
                        flake.currentAlpha += (targetAlpha - flake.currentAlpha) * 0.1;

                        // If currentAlpha is very low and we're not active, we can skip further processing for this flake
                        if (flake.currentAlpha < 0.01 && !isGlobalActive) {
                            flake.sprite.visible = false; // Ensure it's hidden
                            return;
                        }

                        // Helper for pixel movement
                        const applyPixelMovement = (speedMult, density, scaleMult) => {
                            // Density Culling
                            // If index is outside the density range for this mode, hide it.
                            if (index >= density) {
                                flake.sprite.visible = false;
                                return;
                            }
                            flake.sprite.visible = true;
                            flake.sprite.alpha = flake.currentAlpha; // Apply simulated alpha

                            // Update Scale
                            const finalScale = flake.originalScale * scaleMult;
                            if (flake.sprite.scale.x !== finalScale) {
                                flake.sprite.scale.set(finalScale, finalScale);
                            }

                            // No rotation
                            flake.sprite.rotation = 0;

                            // Move
                            const depth = flake.originalScale;
                            flake.y += flake.speed * deltaTime * 60 * depth * speedMult;
                            flake.x += flake.windSpeed * deltaTime * 20 * depth * speedMult;

                            // Minimal jitter
                            if (Math.random() > 0.9) {
                                flake.x += (Math.random() - 0.5) * 2;
                            }
                        };

                        if (flake.isDying) {
                            // "Melting" Effect: Squash and Fade
                            flake.currentAlpha -= 0.08;
                            flake.sprite.alpha = Math.max(0, flake.currentAlpha);
                            // Flatten horizontally
                            const squashRate = 0.05 * flake.originalScale;
                            flake.sprite.scale.x += squashRate;
                            flake.sprite.scale.y = Math.max(0, flake.sprite.scale.y - squashRate);

                            if (flake.currentAlpha <= 0) {
                                resetSnowflake(flake, true);
                            }
                            return; // Skip normal movement
                        }

                        if (isSnow) {
                            // Heavy Snow: Slower (reduced 20%), HUGE, Slightly less dense (80%)
                            // Scale up by 1.5x, Speed 1.6x, 1600 particles
                            applyPixelMovement(1.6, 1600, 1.5);
                        } else {
                            // Flurry: Standard Pixel Snow
                            // Density 1800
                            // Updated: Particle size +20% (1.2), Speed -20% (1.5 -> 1.2)
                            applyPixelMovement(1.2, 1800, 1.2);
                        }

                        // Retro Pixel Movement: Snap to grid (simulates low-res)
                        // Snap to every 2 pixels to make movement feel "chunky"
                        flake.sprite.x = Math.floor(flake.x / 2) * 2;
                        flake.sprite.y = Math.floor(flake.y / 2) * 2;

                        if (flake.y > flake.maxY) {
                            // Trigger death/melting instead of instant reset
                            flake.isDying = true;
                            flake.y = flake.maxY;
                            flake.sprite.y = flake.maxY;
                        }
                        if (flake.x > window.innerWidth + 50) {
                            flake.x = -20;
                            flake.sprite.x = flake.x;
                        } else if (flake.x < -50) {
                            flake.x = window.innerWidth + 20;
                            flake.sprite.x = flake.x;
                        }
                    });

                    animationFrameId = requestAnimationFrame(animate);
                };

                animationFrameId = requestAnimationFrame(animate);
            } catch (error) {
                if (!disposed) {
                    console.error('PixiSnowEffect init failed:', error);
                }
                destroyApp();
            }
        };

        const createSnowflake = (currentApp) => {
            // Integer scales for CHUNKY pixel art look and Depth Culling
            const type = Math.random();
            let scale = 2;
            let maxY = window.innerHeight + 50;

            // Updated Disappearance Probability:
            // 80% Background (stops at Hills)
            // 15% Midground (stops at Grass)
            // 5% Foreground (falls to bottom)
            if (type > 0.95) {
                scale = 6;      // Foreground: Huge chunks
                maxY = window.innerHeight + 50; // Fall to bottom
            } else if (type > 0.80) {
                scale = 4;  // Midground: Medium flakes
                maxY = window.innerHeight * 0.75 + Math.random() * 50; // Stop around Grass
            } else {
                scale = 2;   // Background: Small flakes (80% of all snow)
                maxY = window.innerHeight * 0.45 + Math.random() * 50; // Stop around Hills
            }

            const snowflake = new PIXI.Sprite(PIXI.Texture.WHITE);
            snowflake.width = 2 * scale; // Result: 4px, 8px, 12px squares
            snowflake.height = 2 * scale;
            snowflake.tint = 0xFFFFFF; // Pure white

            const flake = {
                sprite: snowflake,
                originalScale: scale,
                maxY: maxY, // Store the culling height
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                baseAlpha: 0.85 + Math.random() * 0.15,
                currentAlpha: 0,
                speed: 3 + Math.random() * 2,
                drift: (Math.random() - 0.5) * 5,
                windSpeed: 5 + Math.random() * 5,
                phase: Math.random() * Math.PI * 2,
                rotation: 0,
                rotationSpeed: 0,
                swayRate: 1,
                swayAmplitude: 1
            };
            return resetSnowflake(flake);
        };

        const resetSnowflake = (flake, resetY = false) => {
            flake.x = Math.random() * window.innerWidth;
            flake.y = resetY ? -20 : Math.random() * window.innerHeight;
            flake.isDying = false; // Reset death state
            flake.currentAlpha = 0; // Start invisible and fade in

            if (flake.sprite) {
                flake.sprite.x = flake.x;
                flake.sprite.y = flake.y;
                // Reset scale to avoid squashed state persisting
                flake.sprite.scale.set(flake.originalScale, flake.originalScale);
                flake.sprite.visible = true;
            }
            return flake;
        };

        initPixi();

        return () => {
            disposed = true;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            destroyApp();
        };
    }, []); // Run once on mount

    useEffect(() => {
        weatherStateRef.current = {
            isActive: !!isActive,
            isFlurry: !!isFlurry,
            isSnow: !!isSnow,
        };
    }, [isActive, isFlurry, isSnow]);

    return (
        <div
            ref={containerRef}
            className={`pixi-snow-container ${isActive ? 'active' : ''} ${mode}`}
        />
    );
};

export default PixiSnowEffect;
