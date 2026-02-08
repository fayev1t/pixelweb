import React, { useState } from 'react';
import ParallaxBackground from './components/ParallaxBackground';
import AudioPlayer from './components/AudioPlayer';
import RainEffect from './components/RainEffect';
import SnowEffect from './components/SnowEffect';
import './App.css';

function App() {
  const [weather, setWeather] = useState('none'); // 'none', 'light', 'heavy', 'snow'

  return (
    <div className={`app-container scene-${weather}`}>
      <ParallaxBackground weather={weather} />
      <RainEffect mode={weather} />
      <SnowEffect active={weather === 'snow'} />

      <AudioPlayer weather={weather} />

      {/* Weather Switcher */}
      <div className="weather-controls">
        <button onClick={() => setWeather('none')} className={weather === 'none' ? 'active' : ''}>SUNNY</button>
        <button onClick={() => setWeather('light')} className={weather === 'light' ? 'active' : ''}>DRIZZLE</button>
        <button onClick={() => setWeather('heavy')} className={weather === 'heavy' ? 'active' : ''}>STORM</button>
        <button onClick={() => setWeather('snow')} className={weather === 'snow' ? 'active' : ''}>SNOW</button>
      </div>
    </div>
  );
}

export default App;
