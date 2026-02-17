import React, { useState } from 'react';
import ParallaxBackground from './components/ParallaxBackground';
import AudioPlayer from './components/AudioPlayer';
import RainEffect from './components/RainEffect';
import SnowEffect from './components/SnowEffect';
import PixiSnowEffect from './components/PixiSnowEffect';
import './App.css';

function App() {
  const [weather, setWeather] = useState('none'); // 'none', 'light', 'heavy', 'flurry', 'snow'
  const [orientation, setOrientation] = useState(0);

  return (
    <div className="app-container">
      <ParallaxBackground weather={weather} orientation={orientation} />

      <RainEffect mode={weather} />
      <SnowEffect mode={weather} />
      {(weather === 'flurry' || weather === 'snow') && (
        <PixiSnowEffect mode={weather} />
      )}

      <AudioPlayer weather={weather} />

      {/* Controls */}
      <div className="controls-panel">
        <div className="weather-controls">
          <button onClick={() => setWeather('none')} className={weather === 'none' ? 'active' : ''}>SUNNY</button>
          <button onClick={() => setWeather('light')} className={weather === 'light' ? 'active' : ''}>DRIZZLE</button>
          <button onClick={() => setWeather('heavy')} className={weather === 'heavy' ? 'active' : ''}>STORM</button>
          <button onClick={() => setWeather('flurry')} className={weather === 'flurry' ? 'active' : ''}>FLURRY</button>
          <button onClick={() => setWeather('snow')} className={weather === 'snow' ? 'active' : ''}>SNOW</button>
        </div>

        <div className="orientation-controls">
          <button onClick={() => setOrientation(0)} className={orientation === 0 ? 'active' : ''}>FRONT</button>
          <button onClick={() => setOrientation(1)} className={orientation === 1 ? 'active' : ''}>BACK</button>
          <button onClick={() => setOrientation(2)} className={orientation === 2 ? 'active' : ''}>RIGHT</button>
          <button onClick={() => setOrientation(3)} className={orientation === 3 ? 'active' : ''}>LEFT</button>
        </div>
      </div>
    </div>
  );
}

export default App;
