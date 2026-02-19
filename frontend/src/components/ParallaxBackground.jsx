import React from 'react';
import sky from '../assets/background/LandingPage_Sky.webp';
import mountains from '../assets/background/LandingPage_Mountain.webp';
import zyj from '../assets/background/zyj.png';
import poppyImg from '../assets/background/flowers/Invicon_Poppy.png';
import azureBluetImg from '../assets/background/flowers/Invicon_Azure_Bluet.png';
import heartIcon from '../assets/hearticon.svg';
import AnimatedLayer from './AnimatedLayer';
import PixelLightning from './PixelLightning';
import PixelCharacter from './PixelCharacter';

import '../App.css';

// Import character assets
import bodyIdle from '../assets/background/character/body-idle.png';
import hairIdle from '../assets/background/character/hair1-idle.png';
import outfitIdle from '../assets/background/character/outfit1-idle.png';

// Import PNG sequences
const grassNormal = import.meta.glob('../assets/background/LandingPage_Grass_png/*.png', { eager: true, query: '?url', import: 'default' });
const hillsNormal = import.meta.glob('../assets/background/LandingPage_Hills_png/*.png', { eager: true, query: '?url', import: 'default' });
const grassSnow = import.meta.glob('../assets/background/grass_snow/*.png', { eager: true, query: '?url', import: 'default' });
const hillsSnow = import.meta.glob('../assets/background/hill_snow/*.png', { eager: true, query: '?url', import: 'default' });
const allFlowers = import.meta.glob('../assets/background/flowers/*.png', { eager: true, query: '?url', import: 'default' });

const FLOWER_DESCRIPTIONS = {
    'Invicon_Dandelion.png': '蒲公英（Dandelion）',
    'Invicon_Poppy.png': '虞美人（Poppy）',
    'Invicon_Oxeye_Daisy.png': '滨菊（Oxeye Daisy）',
    'Invicon_Cornflower.png': '矢车菊（Cornflower）',
    'Invicon_Lily_of_the_Valley.png': '铃兰（Lily of the Valley）',
    'Invicon_Blue_Orchid.png': '兰花（Blue Orchid）',
    'Invicon_Azure_Bluet.png': '蓝花美耳草（Azure Bluet）'
};

const getFlowerInfo = (url) => {
    if (!url) return null;
    const filename = url.split('/').pop().split('?')[0]; // 处理可能的 query 字符串
    return {
        name: FLOWER_DESCRIPTIONS[filename] || '未名的花',
        url: url
    };
};

const ParallaxBackground = ({
    weather,
    orientation = 1,
    showFlower = false,
    showDialog = false,
    displayText = '',
    charPhase = 'idle',
    holdingFlower = false,
    isBending = false,
    isAccepted = false,
    onAccept = () => { },
    onDialogueClick = () => { },

    dialogueStep = 0,
    onCharacterEnter = () => { },
    onCharacterLeave = () => { },
    isSheltered = false
}) => {
    // Separate snow logic
    const isHillSnow = weather === 'snow' || weather === 'flurry';
    const isGrassSnow = weather === 'snow';
    const isRaining = weather === 'light' || weather === 'heavy';
    const isSnowing = weather === 'snow' || weather === 'flurry';

    const [flash, setFlash] = React.useState(false);
    const prevWeatherRef = React.useRef(weather);
    const [showTransitionLightning, setShowTransitionLightning] = React.useState(false);
    const [infoFlower, setInfoFlower] = React.useState(null);
    const [showAcceptFlower, setShowAcceptFlower] = React.useState(false);

    // 监听接受状态触发动画
    React.useEffect(() => {
        if (isAccepted) {
            setShowAcceptFlower(true);
            // 动画结束后（假设1.8s）自动移除，以便下次可能需要（虽然需求说就一次）
            setTimeout(() => setShowAcceptFlower(false), 2000);
        }
    }, [isAccepted]);

    const handleFlash = React.useCallback(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
    }, []);

    React.useEffect(() => {
        const prev = prevWeatherRef.current;
        prevWeatherRef.current = weather;
        if ((prev === 'light' && weather === 'heavy') ||
            (prev === 'heavy' && weather === 'flurry')) {
            handleFlash();
            setShowTransitionLightning(true);
            setTimeout(() => setShowTransitionLightning(false), 1000);
        }
    }, [weather, handleFlash]);

    const fps = 12;
    const showLightning = weather === 'heavy' || showTransitionLightning;

    // Generate flower positions for the hill based on user regions
    const flowerData = React.useMemo(() => {
        const flowerUrls = Object.values(allFlowers);
        const regions = [
            { left: [0, 100], bottom: [22, 52] },  // 全局散布
            { left: [2, 45], bottom: [24, 48] },   // 广域左侧
            { left: [52, 98], bottom: [26, 52] },  // 广域右侧
            { left: [0, 100], bottom: [25, 45] }   // 再次全局叠加
        ];

        return Array.from({ length: 88 }).map((_, i) => {
            const region = regions[i % regions.length];
            // 进一步增加随机扰动
            const leftVal = region.left[0] + Math.random() * (region.left[1] - region.left[0]);
            const bottomVal = region.bottom[0] + Math.random() * (region.bottom[1] - region.bottom[0]);

            return {
                id: i,
                url: flowerUrls[Math.floor(Math.random() * flowerUrls.length)],
                left: `${leftVal}%`,
                bottom: `${bottomVal}%`,
                delay: Math.random() * 4, // 进一步拉开生长的时间跨度
                scale: 0.6 + Math.random() * 0.8, // 尺寸更加随机
                rotation: (Math.random() - 0.5) * 20, // 随机偏角
                swayDur: 2 + Math.random() * 1, // 随机摆动时长 (2-3s)
                swayDelay: Math.random() * -5 // 随机摆动延迟
            };
        });
    }, []);

    return (
        <div className={`parity-container weather-${weather}`} onClick={() => setInfoFlower(null)}>
            <div className={`layer layer-sky ${flash ? 'flash-darken' : ''}`} style={{ backgroundImage: `url(${sky})`, pointerEvents: 'none' }}></div>
            {showLightning && <PixelLightning onFlash={handleFlash} />}
            <div className={`layer layer-mountains ${flash ? 'flash-darken' : ''}`} style={{ backgroundImage: `url(${mountains})`, pointerEvents: 'none' }}></div>
            <AnimatedLayer className="layer layer-hills layer-hills-normal weather-layer" imagesMap={hillsNormal} fps={fps} style={{ opacity: 1, pointerEvents: 'none' }} />
            <AnimatedLayer className="layer layer-hills layer-hills-snow weather-layer" imagesMap={hillsSnow} fps={fps} style={{ opacity: isHillSnow ? 1 : 0, pointerEvents: 'none' }} />

            <div className="character-container" style={{ zIndex: 10 }}>
                {/* 雨伞悬停检测区域 - 包裹角色，向上延伸检测范围 */}
                <div
                    className={`umbrella-hover-zone ${isSheltered ? 'sheltered' : ''}`}
                    onMouseEnter={onCharacterEnter}
                    onMouseLeave={onCharacterLeave}
                    style={{ pointerEvents: isAccepted ? 'none' : 'auto' }}
                >
                    {/* 角色移动包装器 */}
                    <div className={`char-mover ${charPhase} ${isBending ? 'bending' : ''} ${isAccepted ? 'accepted' : ''} ${isRaining && !isSheltered ? 'char-is-wet' : ''}`}>
                        <div
                            className={`character-interactive-area ${orientation === 0 && !isAccepted ? 'can-accept' : ''}`}
                            style={{
                                position: 'relative',
                                pointerEvents: isAccepted ? 'none' : 'auto'
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // 阻止触发背景的关闭逻辑
                                if (isAccepted) return;

                                // 如果是转身状态，触发“收下”
                                if (orientation === 0) {
                                    onAccept();
                                    return;
                                }

                                const container = e.currentTarget;
                                const rect = container.getBoundingClientRect();

                                // 从小人周围随机位置出现爱心
                                const charW = rect.width;
                                const charH = rect.height;
                                const randX = Math.random() * charW;
                                const randY = charH * 0.15 + Math.random() * charH * 0.7;

                                const heart = document.createElement('img');
                                heart.src = heartIcon;
                                heart.className = `pixel-heart heart-particle`;

                                // 随机弹道，总体向上飘散
                                const angle = (Math.random() * Math.PI * 0.4) - (Math.PI * 0.7);
                                const distance = 50 + Math.random() * 30;
                                const txEnd = Math.cos(angle) * distance;
                                const tyEnd = Math.sin(angle) * distance - 20;
                                const rot = (Math.random() - 0.5) * 40;
                                const dur = 1.0;

                                heart.style.setProperty('--tx', `0px`);
                                heart.style.setProperty('--ty', `-10px`);
                                heart.style.setProperty('--tx-end', `${txEnd}px`);
                                heart.style.setProperty('--ty-end', `${tyEnd}px`);
                                heart.style.setProperty('--rot', `${rot}deg`);
                                heart.style.setProperty('--dur', `${dur}s`);

                                heart.style.left = `${randX}px`;
                                heart.style.top = `${randY}px`;
                                heart.style.width = '24px';
                                heart.style.height = '24px';
                                heart.style.position = 'absolute';
                                heart.style.transformOrigin = 'center';

                                container.appendChild(heart);
                                setTimeout(() => heart.remove(), dur * 1000);
                            }}
                        >
                            {/* 收下提示文本 */}
                            {orientation === 0 && !isAccepted && (
                                <div className="accept-hint">收下</div>
                            )}

                            {/* 收下后的花朵弹出动画 */}
                            {showAcceptFlower && (
                                <img className="flower-accept-particle" src={azureBluetImg} alt="" />
                            )}

                            <PixelCharacter
                                layers={[
                                    bodyIdle,
                                    { url: hairIdle, style: { filter: 'sepia(0.6) hue-rotate(-20deg) saturate(1.8) brightness(0.7) contrast(1.1)' } },
                                    outfitIdle
                                ]}
                                orientation={orientation}
                                scale={5}
                                fps={5}
                            />

                            {/* 手持花 - 可点击查看信息 */}
                            {holdingFlower && orientation === 0 && !isAccepted && (
                                <div
                                    className="flower-bob-wrapper"
                                    style={{ pointerEvents: 'auto', cursor: 'help' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setInfoFlower({
                                            ...getFlowerInfo(azureBluetImg),
                                            x: e.clientX,
                                            y: e.clientY
                                        });
                                    }}
                                >
                                    <img className="held-flower" src={azureBluetImg} alt="" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 对话框 */}
                <div
                    className={`pixel-dialog dialog-center ${showDialog ? 'show' : ''}`}
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDialogueClick();
                    }}
                >
                    <div className="dialog-content">
                        <span className="dialog-text">{displayText}</span>
                        {dialogueStep === 0 && !isAccepted && (
                            <div className="dialogue-next-indicator">
                                <span className="dialogue-next-arrow">▼</span>
                            </div>
                        )}
                    </div>
                </div>


            </div>

            <AnimatedLayer className="layer layer-grass layer-grass-normal weather-layer" imagesMap={grassNormal} fps={fps} style={{ opacity: 1, pointerEvents: 'none' }} />
            <AnimatedLayer className="layer layer-grass layer-grass-snow weather-layer" imagesMap={grassSnow} fps={fps} style={{ opacity: isGrassSnow ? 1 : 0, pointerEvents: 'none' }}>
                <img className="snow-right-grass-decoration" src={zyj} alt="" aria-hidden="true" />
            </AnimatedLayer>

            {/* Hill Flowers Interaction Layer - Placed above Grass (z-index 5) but below Character (z-index 10) */}
            <div
                className="flowers-interaction-layer"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 6,
                    pointerEvents: 'none',
                    overflow: 'hidden'
                }}
            >
                {(weather === 'none' || weather === 'light' || weather === 'flurry') && flowerData.map(flower => (
                    <div
                        key={flower.id}
                        className={`poppy-flower ${showFlower ? 'grow' : ''}`}
                        style={{
                            position: 'absolute',
                            left: flower.left,
                            bottom: flower.bottom,
                            animationDelay: `${flower.delay}s`,
                            '--sway-dur': `${flower.swayDur}s`,
                            '--sway-delay': `${flower.swayDelay}s`,
                            opacity: showFlower ? 1 : 0,
                            zIndex: 1,
                            right: 'auto',
                            cursor: 'help',
                            pointerEvents: 'auto'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setInfoFlower({
                                ...getFlowerInfo(flower.url),
                                x: e.clientX,
                                y: e.clientY
                            });
                        }}
                    >
                        <img
                            src={flower.url}
                            style={{
                                width: '40px',
                                height: '40px',
                                transform: `scale(${flower.scale}) rotate(${flower.rotation}deg)`,
                                imageRendering: 'pixelated'
                            }}
                            alt=""
                            aria-hidden="true"
                        />
                    </div>
                ))}
            </div>

            {/* 花朵介绍弹窗 - 移动到顶层以避开滤镜影响 */}
            {infoFlower && (
                <div
                    className="flower-info-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        pointerEvents: 'none', // 允许点击穿透到下面的花
                        display: 'block',
                        background: 'transparent',
                        backdropFilter: 'none'
                    }}
                >
                    <div
                        className="flower-info-box"
                        onClick={e => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            left: infoFlower.x,
                            top: infoFlower.y,
                            transform: 'translate(-50%, -100%) translateY(-20px)',
                            pointerEvents: 'auto' // 介绍框本身要能响应点击（比如关闭按钮）
                        }}
                    >
                        <div className="flower-info-icon">
                            <img src={infoFlower.url} alt="" />
                        </div>
                        <div className="flower-info-content">
                            <div className="flower-info-title">{infoFlower.name}</div>
                        </div>
                        <button className="flower-info-close" onClick={() => setInfoFlower(null)}>×</button>
                    </div>
                </div>
            )}
        </div >
    );
};

export default ParallaxBackground;
