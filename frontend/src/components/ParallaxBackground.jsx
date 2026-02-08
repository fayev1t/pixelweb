import React from 'react';
import sky from '../assets/background/LandingPage_Sky_first.webp';
import mountains from '../assets/background/LandingPage_Mountain_first.webp';
import hills from '../assets/background/LandingPage_Hills_first.webp';
import grass from '../assets/background/LandingPage_Grass_first.webp';
import PixelLightning from './PixelLightning';
import '../App.css';

const ParallaxBackground = ({ weather }) => {
    return (
        <div className="parity-container">
            <div className="layer layer-sky" style={{ backgroundImage: `url(${sky})` }}></div>
            {weather === 'heavy' && <PixelLightning />}
            <div className="layer layer-mountains" style={{ backgroundImage: `url(${mountains})` }}></div>
            <div className="layer layer-hills" style={{ backgroundImage: `url(${hills})` }}></div>
            <div className="layer layer-grass" style={{ backgroundImage: `url(${grass})` }}></div>
        </div>
    );
};

export default ParallaxBackground;
