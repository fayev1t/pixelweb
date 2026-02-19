import React, { useEffect, useRef, useMemo } from 'react';
import './UmbrellaShield.css';

const UmbrellaShield = ({ isActive, weather }) => {
    const shieldRef = useRef(null);
    const isRaining = weather === 'light' || weather === 'heavy';
    const isHeavyRain = weather === 'heavy';
    const isSnowing = weather === 'snow' || weather === 'flurry';

    useEffect(() => {
        if (!isActive) return;
        const handleMouseMove = (e) => {
            if (shieldRef.current) {
                shieldRef.current.style.left = `${e.clientX}px`;
                shieldRef.current.style.top = `${e.clientY}px`;
            }
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [isActive]);

    const rainParticles = useMemo(() =>
        Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            left: 10 + Math.random() * 80,
            delay: Math.random() * 0.8,
            duration: 0.2 + Math.random() * 0.25,
            offsetX: (Math.random() - 0.5) * 18,
            bounceH: 5 + Math.random() * 8,
        })), []
    );

    const snowParticles = useMemo(() =>
        Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            startX: 15 + Math.random() * 70,
            delay: Math.random() * 2,
            duration: 0.5 + Math.random() * 0.8,
            direction: Math.random() > 0.5 ? 1 : -1,
            size: 2 + Math.floor(Math.random() * 2),
        })), []
    );

    const weatherClass = isHeavyRain ? 'weather-heavy'
        : isRaining ? 'weather-light'
            : isSnowing ? 'weather-snow' : '';

    return (
        <div
            ref={shieldRef}
            className={`umbrella-shield ${isActive ? 'active' : ''} ${weatherClass}`}
        >
            {/*
              24x20 网格, 渲染 120x100px (5px/像素)
              宽伞面 22px=110px, 细伞柄 1px=5px
            */}
            <svg
                className="umbrella-svg"
                viewBox="0 0 24 20"
                xmlns="http://www.w3.org/2000/svg"
                shapeRendering="crispEdges"
            >
                {/* ── 伞尖 ── */}
                <rect x="11" y="0" width="2" height="1" fill="#1a2535" />

                {/* ── 伞面圆顶 ── */}
                {/* Row 1 */}
                <rect x="8" y="1" width="2" height="1" fill="#1a2535" />
                <rect x="10" y="1" width="4" height="1" fill="#9CCCE8" />
                <rect x="14" y="1" width="2" height="1" fill="#1a2535" />

                {/* Row 2 */}
                <rect x="6" y="2" width="1" height="1" fill="#1a2535" />
                <rect x="7" y="2" width="10" height="1" fill="#90C4E0" />
                <rect x="17" y="2" width="1" height="1" fill="#1a2535" />

                {/* Row 3 */}
                <rect x="5" y="3" width="1" height="1" fill="#1a2535" />
                <rect x="6" y="3" width="4" height="1" fill="#80B8D8" />
                <rect x="10" y="3" width="8" height="1" fill="#6CAACE" />
                <rect x="18" y="3" width="1" height="1" fill="#1a2535" />

                {/* Row 4 */}
                <rect x="4" y="4" width="1" height="1" fill="#1a2535" />
                <rect x="5" y="4" width="3" height="1" fill="#6CAACE" />
                <rect x="8" y="4" width="11" height="1" fill="#589CC2" />
                <rect x="19" y="4" width="1" height="1" fill="#1a2535" />

                {/* Row 5 */}
                <rect x="3" y="5" width="1" height="1" fill="#1a2535" />
                <rect x="4" y="5" width="2" height="1" fill="#589CC2" />
                <rect x="6" y="5" width="14" height="1" fill="#488EB6" />
                <rect x="20" y="5" width="1" height="1" fill="#1a2535" />

                {/* Row 6 */}
                <rect x="2" y="6" width="1" height="1" fill="#1a2535" />
                <rect x="3" y="6" width="18" height="1" fill="#3C80A8" />
                <rect x="21" y="6" width="1" height="1" fill="#1a2535" />

                {/* Row 7 */}
                <rect x="1" y="7" width="1" height="1" fill="#1a2535" />
                <rect x="2" y="7" width="20" height="1" fill="#30729C" />
                <rect x="22" y="7" width="1" height="1" fill="#1a2535" />

                {/* Row 8 - 底部 */}
                <rect x="1" y="8" width="1" height="1" fill="#1a2535" />
                <rect x="2" y="8" width="20" height="1" fill="#286490" />
                <rect x="22" y="8" width="1" height="1" fill="#1a2535" />

                {/* Row 9 - 波浪底边 */}
                <rect x="1" y="9" width="1" height="1" fill="#1a2535" />
                <rect x="2" y="9" width="3" height="1" fill="#205680" />
                <rect x="5" y="9" width="2" height="1" fill="#1a2535" />
                <rect x="7" y="9" width="4" height="1" fill="#205680" />
                <rect x="11" y="9" width="2" height="1" fill="#1a2535" />
                <rect x="13" y="9" width="4" height="1" fill="#205680" />
                <rect x="17" y="9" width="2" height="1" fill="#1a2535" />
                <rect x="19" y="9" width="3" height="1" fill="#205680" />
                <rect x="22" y="9" width="1" height="1" fill="#1a2535" />

                {/* Row 10 - 波浪尖端 */}
                <rect x="2" y="10" width="3" height="1" fill="#1a2535" />
                <rect x="7" y="10" width="4" height="1" fill="#1a2535" />
                <rect x="13" y="10" width="4" height="1" fill="#1a2535" />
                <rect x="19" y="10" width="3" height="1" fill="#1a2535" />

                {/* ── 伞柄 (1px 细柄) ── */}
                <rect x="12" y="10" width="1" height="7" fill="#907050" />

                {/* ── J型弯钩 ── */}
                <rect x="10" y="17" width="2" height="1" fill="#907050" />
                <rect x="9" y="16" width="1" height="2" fill="#907050" />
                <rect x="9" y="18" width="2" height="1" fill="#1a2535" />
            </svg>

            {isRaining && (
                <div className="umbrella-rain-bounce">
                    {rainParticles.map((p) => (
                        <div
                            key={p.id}
                            className={`rain-bounce-particle ${isHeavyRain ? 'heavy' : ''}`}
                            style={{
                                left: `${p.left}%`,
                                '--delay': `${p.delay}s`,
                                '--duration': `${p.duration}s`,
                                '--offset-x': `${p.offsetX}px`,
                                '--bounce-h': `${p.bounceH}px`,
                            }}
                        />
                    ))}
                </div>
            )}

            {isSnowing && (
                <div className="umbrella-snow-slide">
                    {snowParticles.map((p) => (
                        <div
                            key={p.id}
                            className="snow-slide-particle"
                            style={{
                                left: `${p.startX}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                '--delay': `${p.delay}s`,
                                '--duration': `${p.duration}s`,
                                '--dir': p.direction,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UmbrellaShield;
