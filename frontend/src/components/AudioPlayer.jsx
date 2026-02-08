import React, { useState, useRef, useEffect } from 'react';
import musicFile from '../assets/music/welcomeandgoodbye.mp3';

const AudioPlayer = ({ weather }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // 获取天气对应的颜色
    const getStatusColor = () => {
        if (weather === 'light') return '#aaccee';
        if (weather === 'heavy') return '#778899';
        if (weather === 'snow') return '#bfe8ff';
        return '#ffcc00';
    };

    const getStatusText = () => {
        if (!isPlaying) return 'PAUSED';
        if (weather === 'none') return 'NOW PLAYING';
        if (weather === 'snow') return 'PLAYING IN SNOW';
        return `PLAYING IN ${weather.toUpperCase()} RAIN`;
    };

    return (
        <div className={`pixel-audio-player player-mode-${weather}`}>
            <audio ref={audioRef} src={musicFile} loop />
            <button className={`play-button ${isPlaying ? 'playing' : ''}`}
                style={{ backgroundColor: getStatusColor() }}
                onClick={togglePlay}>
                <div className="icon"></div>
            </button>
            <div className="music-info">
                <div className="track-name">welcomeandgoodbye.mp3</div>
                <div className="status" style={{ color: getStatusColor() }}>
                    {getStatusText()}
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
