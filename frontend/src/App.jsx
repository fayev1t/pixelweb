import React, { useState, useCallback, useRef, useEffect } from 'react';
import ParallaxBackground from './components/ParallaxBackground';
import AudioPlayer from './components/AudioPlayer';
import RainEffect from './components/RainEffect';
import SnowEffect from './components/SnowEffect';
import PixiSnowEffect from './components/PixiSnowEffect';
import UmbrellaShield from './components/UmbrellaShield';
import './App.css';

const WEATHER_SCHEDULE = [
  { time: 0, weather: 'none' },
  { time: 9.27, weather: 'light' },
  { time: 16.42, weather: 'heavy' },
  { time: 23.31, weather: 'flurry' },
  { time: 29.94, weather: 'snow' },
  { time: 40.44, weather: 'none' },
];

function App() {
  const [weather, setWeather] = useState('none');
  const lastWeatherRef = useRef('none');

  // 状态控制
  const [showFlower, setShowFlower] = useState(false);
  const [holdingFlower, setHoldingFlower] = useState(false);
  const [characterFacing, setCharacterFacing] = useState(1);
  const [charPhase, setCharPhase] = useState('idle');
  const [isBending, setIsBending] = useState(false); // 弯腰捡花
  const [showDialog, setShowDialog] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [dialogueContent, setDialogueContent] = useState('');
  const [dialogueStep, setDialogueStep] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isCharacterHovered, setIsCharacterHovered] = useState(false);
  const sequenceStartedRef = useRef(false);

  // Determine if character is sheltered (umbrella active)
  const isRainingOrSnowing = ['light', 'heavy', 'snow', 'flurry'].includes(weather);
  const isSheltered = isCharacterHovered && isRainingOrSnowing;

  // 打字机效果
  useEffect(() => {
    if (showDialog && dialogueContent) {
      let i = 0;
      setDisplayText('');
      const timer = setInterval(() => {
        setDisplayText(dialogueContent.slice(0, i + 1));
        i++;
        if (i >= dialogueContent.length) clearInterval(timer);
      }, 150);
      return () => clearInterval(timer);
    } else if (!showDialog) {
      setDisplayText('');
    }
  }, [showDialog, dialogueContent]);

  const handleDialogueClick = useCallback(() => {
    // 不需要第二句对话
  }, []);

  const handleAccept = useCallback(() => {
    if (isAccepted) return;
    setIsAccepted(true);
    setShowDialog(false);

    // 触发收下动画的逻辑在 ParallaxBackground 中实现
    setTimeout(() => {
      setCharacterFacing(1); // 回头
      setHoldingFlower(false);

      // 转身后说“........”
      setDialogueContent("........");
      setShowDialog(true);

      setTimeout(() => {
        setShowDialog(false);
      }, 3000);
    }, 2000);
  }, [isAccepted]);

  const startFlowerSequence = useCallback(() => {
    if (sequenceStartedRef.current) return;
    sequenceStartedRef.current = true;

    // 1s: 满山花开
    setTimeout(() => setShowFlower(true), 1000);

    // 6s: 进入“准备好”的状态
    setTimeout(() => setHoldingFlower(true), 6000);

    // 7s: 转身面向镜头
    setTimeout(() => setCharacterFacing(0), 7000);

    // 8s: 弹出对话框
    setTimeout(() => {
      setDialogueStep(0);
      setDialogueContent("..........");
      setShowDialog(true);
    }, 8000);
  }, []);

  const handleAudioTimeUpdate = useCallback((currentTime) => {
    let target = 'none';
    for (let i = WEATHER_SCHEDULE.length - 1; i >= 0; i--) {
      if (currentTime >= WEATHER_SCHEDULE[i].time) {
        target = WEATHER_SCHEDULE[i].weather;
        break;
      }
    }
    if (lastWeatherRef.current !== target) {
      if (lastWeatherRef.current === 'snow' && target === 'none') {
        startFlowerSequence();
      }
      lastWeatherRef.current = target;
      setWeather(target);
    }
  }, [startFlowerSequence]);

  return (
    <div className="app-container">
      <ParallaxBackground
        weather={weather}
        orientation={characterFacing}
        showFlower={showFlower}
        showDialog={showDialog}
        displayText={displayText}
        charPhase={charPhase}
        holdingFlower={holdingFlower}
        isBending={isBending}
        isAccepted={isAccepted}
        onAccept={handleAccept}
        onDialogueClick={handleDialogueClick}
        dialogueStep={dialogueStep}
        onCharacterEnter={() => setIsCharacterHovered(true)}
        onCharacterLeave={() => setIsCharacterHovered(false)}
        isSheltered={isSheltered}
      />
      <RainEffect mode={weather} isSheltered={isSheltered} />
      <SnowEffect mode={weather} isSheltered={isSheltered} />
      <PixiSnowEffect mode={weather} />
      <UmbrellaShield isActive={isSheltered} weather={weather} />
      <AudioPlayer weather={weather} onTimeUpdate={handleAudioTimeUpdate} showFlower={showFlower} />
    </div>
  );
}

export default App;
