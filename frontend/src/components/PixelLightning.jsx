import React, { useCallback, useEffect, useRef } from 'react';
import './PixelLightning.css';

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 180;

const PRESET = {
    color: '#9cdcff',
    core: '#f8fbff',
    bloom: 6,
    complexity: 0.55,
    branching: 0.55
};

const PHASES = {
    IDLE: 0,
    IGNITE: 1,
    DECAY: 2,
    REIGNITE: 3,
    SUSTAIN: 4,
    FADE: 5
};

const PixelLightning = () => {
    const canvasRef = useRef(null);
    const animState = useRef({
        phase: PHASES.IDLE,
        timer: 0,
        segments: [],
        alpha: 0,
        widthScale: 1,
        exposure: 0
    });

    const resetState = useCallback(() => {
        animState.current.phase = PHASES.IDLE;
        animState.current.timer = 0;
        animState.current.segments = [];
        animState.current.alpha = 0;
        animState.current.widthScale = 1;
        animState.current.exposure = 0;
    }, []);

    const generateLightning = useCallback(() => {
        const segments = [];
        const startX = CANVAS_WIDTH * (0.2 + Math.random() * 0.6);
        const horizon = CANVAS_HEIGHT * 0.7;

        const createBranch = (x, y, angle, length, depth) => {
            if (length < 4 || depth > 8) return;

            let currX = x;
            let currY = y;
            let remaining = length;

            while (remaining > 0) {
                const step = 2 + Math.floor(Math.random() * 3);
                const jitter = (Math.random() - 0.5) * PRESET.complexity * 1.6;
                const nextAngle = angle + jitter;

                const nextX = Math.round(currX + Math.cos(nextAngle) * step);
                const nextY = Math.round(currY + Math.sin(nextAngle) * step);

                segments.push({
                    x1: currX,
                    y1: currY,
                    x2: nextX,
                    y2: nextY,
                    isCore: depth === 0 || (depth === 1 && Math.random() > 0.5)
                });

                currX = Math.max(2, Math.min(CANVAS_WIDTH - 2, nextX));
                currY = nextY;
                remaining -= step;

                if (Math.random() < PRESET.branching * 0.08) {
                    const branchAngle = nextAngle + (Math.random() < 0.5 ? -0.6 : 0.6);
                    createBranch(currX, currY, branchAngle, remaining * 0.6, depth + 1);
                }

                if (currY > horizon) break;
            }
        };

        createBranch(startX, -10, Math.PI / 2, CANVAS_HEIGHT * 0.9, 0);
        return segments;
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const state = animState.current;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.imageSmoothingEnabled = false;

        if (state.phase === PHASES.IDLE || state.segments.length === 0) return;

        if (state.exposure > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${state.exposure})`;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        ctx.lineCap = 'square';
        ctx.shadowBlur = PRESET.bloom * state.widthScale;
        ctx.shadowColor = PRESET.color;

        ctx.beginPath();
        state.segments.forEach((seg) => {
            if (Math.random() > state.alpha + 0.1) return;
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
        });

        ctx.strokeStyle = PRESET.color;
        ctx.lineWidth = 2 * state.widthScale;
        ctx.globalAlpha = state.alpha;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.beginPath();
        state.segments.forEach((seg) => {
            if (!seg.isCore) return;
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
        });

        ctx.strokeStyle = PRESET.core;
        ctx.lineWidth = 1;
        ctx.globalAlpha = Math.min(1, state.alpha * 1.5);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }, []);

    useEffect(() => {
        let frameId;
        const state = animState.current;
        const fps = 30;
        const interval = 1000 / fps;
        let lastTime = 0;

        const loop = (time) => {
            if (time - lastTime > interval) {
                lastTime = time;

                switch (state.phase) {
                    case PHASES.IDLE:
                        if (Math.random() < 0.008) {
                            state.phase = PHASES.IGNITE;
                            state.timer = 0;
                            state.segments = generateLightning();
                        }
                        break;

                    case PHASES.IGNITE:
                        state.alpha = 1.0;
                        state.widthScale = 1.4;
                        state.exposure = 0.78;
                        if (state.timer > 2) {
                            state.phase = PHASES.DECAY;
                            state.timer = 0;
                        }
                        break;

                    case PHASES.DECAY:
                        state.alpha = 0.35;
                        state.widthScale = 0.9;
                        state.exposure = 0.6;
                        if (state.timer > 3) {
                            state.phase = PHASES.REIGNITE;
                            state.timer = 0;
                        }
                        break;

                    case PHASES.REIGNITE:
                        state.alpha = 0.9;
                        state.widthScale = 1.2;
                        state.exposure = 0.7;
                        if (state.timer > 3) {
                            state.phase = PHASES.SUSTAIN;
                            state.timer = 0;
                        }
                        break;

                    case PHASES.SUSTAIN:
                        state.alpha = 0.35 + Math.random() * 0.4;
                        state.widthScale = 1.0;
                        state.exposure = 0.3 + Math.random() * 0.2;
                        if (state.timer > 18) {
                            state.phase = PHASES.FADE;
                            state.timer = 0;
                        }
                        break;

                    case PHASES.FADE:
                        state.alpha *= 0.82;
                        state.exposure *= 0.94;
                        if (state.alpha < 0.05) {
                            resetState();
                        }
                        break;

                    default:
                        break;
                }

                state.timer += 1;
                draw();
            }

            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [draw, generateLightning, resetState]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, []);

    return (
        <div className="layer-lightning">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                aria-hidden="true"
            />
        </div>
    );
};

export default PixelLightning;
