import React from 'react';
import sky from '../assets/background/LandingPage_Sky.webp';
import mountains from '../assets/background/LandingPage_Mountain.webp';
import zyj from '../assets/background/zyj.png';
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

const ParallaxBackground = ({ weather, orientation = 0 }) => {
    // Separate snow logic for different layers
    const isHillSnow = weather === 'snow' || weather === 'flurry';
    const isGrassSnow = weather === 'snow';

    // Flash state for lightning effect
    const [flash, setFlash] = React.useState(false);

    const handleFlash = React.useCallback(() => {
        setFlash(true);
        // Instant dark (via CSS), then recover after short delay
        setTimeout(() => {
            setFlash(false);
        }, 80);
    }, []);

    // Dynamic FPS based on weather intensity (High wind = faster animation)
    const getFps = () => {
        switch (weather) {
            case 'heavy': // Storm
            case 'snow':  // Blizzard
            case 'flurry': // Windy snow
                return 18; // 1.5x speed for high wind
            default:
                return 12; // Normal gentle wave
        }
    };
    const fps = getFps();

    const isRoughWeather = weather === 'heavy' || weather === 'snow' || weather === 'flurry';
    const skySpeed = isRoughWeather ? '133s' : '200s'; // 50% faster means 2/3 duration

    return (
        <div className={`parity-container weather-${weather}`}>
            <div
                className={`layer layer-sky ${flash ? 'flash-darken' : ''}`}
                style={{
                    backgroundImage: `url(${sky})`,
                    animationDuration: skySpeed
                }}
            ></div>
            {weather === 'heavy' && <PixelLightning onFlash={handleFlash} />}

            <div className={`layer layer-mountains ${flash ? 'flash-darken' : ''}`} style={{ backgroundImage: `url(${mountains})` }}></div>

            <AnimatedLayer
                className="layer layer-hills layer-hills-normal weather-layer"
                imagesMap={hillsNormal}
                fps={fps}
                style={{ opacity: isHillSnow ? 0 : 1 }}
            />

            <AnimatedLayer
                className="layer layer-hills layer-hills-snow weather-layer"
                imagesMap={hillsSnow}
                fps={fps}
                style={{ opacity: isHillSnow ? 1 : 0 }}
            />

            {/* Character positioned to be visible */}
            <div className="character-container" style={{ zIndex: 10 }}>
                <PixelCharacter
                    layers={[
                        bodyIdle,
                        // Auburn/Chestnut hair filter: Matching the reddish-brown tone from the image
                        { url: hairIdle, style: { filter: 'sepia(0.6) hue-rotate(-20deg) saturate(1.8) brightness(0.7) contrast(1.1)' } },
                        outfitIdle
                    ]}
                    orientation={orientation}
                    scale={5}
                    fps={5}
                />
            </div>

            <AnimatedLayer
                className="layer layer-grass layer-grass-normal weather-layer"
                imagesMap={grassNormal}
                fps={fps}
                style={{ opacity: isGrassSnow ? 0 : 1 }}
            />

            <AnimatedLayer
                className="layer layer-grass layer-grass-snow weather-layer"
                imagesMap={grassSnow}
                fps={fps}
                style={{ opacity: isGrassSnow ? 1 : 0 }}
            >
                <img
                    className="snow-right-grass-decoration"
                    src={zyj}
                    alt=""
                    aria-hidden="true"
                />
            </AnimatedLayer>
        </div>
    );
};

export default ParallaxBackground;
