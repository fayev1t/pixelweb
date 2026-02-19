import React, { useState, useRef, useEffect } from 'react';
import { MUSIC_FILE as musicFile, LRC_FILE as lrcFile } from '../constants/assets';
import { parseLRC } from '../utils/lrcParser.js';

const AudioPlayer = ({ weather, onTimeUpdate, showFlower, isLoaded, loadingProgress }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [lyrics, setLyrics] = useState([]);
    const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
    const [currentTime, setCurrentTime] = useState(0);

    // Load lyrics
    useEffect(() => {
        fetch(lrcFile)
            .then(r => r.text())
            .then(text => setLyrics(parseLRC(text)));
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Use RAF for smooth progress updates
    useEffect(() => {
        let animationFrameId;

        const update = () => {
            if (audioRef.current && !audioRef.current.paused) {
                const rawTime = audioRef.current.currentTime;
                // Add 0.4s offset to make lyrics appear earlier (faster response)
                setCurrentTime(rawTime + 0.4);
                // 将原始时间传递给父组件用于自动天气切换
                if (onTimeUpdate) onTimeUpdate(rawTime);
                animationFrameId = requestAnimationFrame(update);
            }
        };

        if (isPlaying) {
            update();
        } else {
            cancelAnimationFrame(animationFrameId);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying]);

    // Update currentLyricIndex based on currentTime
    useEffect(() => {
        let activeIndex = -1;
        for (let i = 0; i < lyrics.length; i++) {
            if (currentTime >= lyrics[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }
        if (activeIndex !== currentLyricIndex) {
            setCurrentLyricIndex(activeIndex);
        }
    }, [currentTime, lyrics, currentLyricIndex]);


    const handleTimeUpdate = () => {
        // Fallback or for coarse updates if needed, 
        // but RAF handles the smooth visual progress.
        // We still keep this to sync non-visual state if needed,
        // but for now we rely on RAF for currentTime when playing.
        if (!isPlaying && audioRef.current) {
            setCurrentTime(audioRef.current.currentTime + 0.4);
        }
    };

    // Resolve the "visual" lyric line (handles tilde/EOF)
    const getVisualLyric = () => {
        if (currentLyricIndex < 0 || !lyrics[currentLyricIndex]) return null;
        const line = lyrics[currentLyricIndex];
        const text = line.text;

        if (text === 'EOF' || text.startsWith('EOF')) return null;

        const isTilde = /^[-\u2013~～]+$/.test(text); // Match dashes or tildes
        if (isTilde) {
            // Find previous non-tilde line
            let prev = currentLyricIndex - 1;
            while (prev >= 0) {
                if (!/^[-\u2013~～]+$/.test(lyrics[prev].text)) {
                    // User requested to remove pulsing effect, just hold the text
                    // Use 'prev' as sourceIndex to keep the key stable
                    return {
                        text: lyrics[prev].text,
                        isPulsing: false,
                        duration: line.duration,
                        time: line.time,
                        sourceIndex: prev
                    };
                }
                prev--;
            }
            return null;
        }

        return {
            text: line.text,
            isPulsing: false,
            duration: line.duration,
            time: line.time,
            sourceIndex: currentLyricIndex
        };
    };

    const visualLyric = getVisualLyric();

    // Calculate progress for karaoke effect
    const getProgress = () => {
        if (!visualLyric || currentLyricIndex < 0) return 0;

        // Use current time vs line start time
        // Note: For dash lines, 'visualLyric.time' comes from the *current* line (the dash line),
        // which resets progress for the new segment. 

        return Math.min(1, Math.max(0, (currentTime - visualLyric.time) / (visualLyric.duration || 1)));
    };

    // Fix for progress resetting on dash lines:
    // If the actual current lyric is a dash line, we want the visualization to likely stay "full".
    const isCurrentLineDash = lyrics[currentLyricIndex] && /^[-\u2013~～]+$/.test(lyrics[currentLyricIndex].text);
    const progress = isCurrentLineDash ? 1 : getProgress();

    // Weather color
    const getStatusColor = () => {
        if (weather === 'light') return '#aaccee';
        if (weather === 'heavy') return '#778899';
        if (weather === 'flurry') return '#9cbdd4';
        if (weather === 'snow') return '#bfe8ff';
        return '#ffcc00';
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={musicFile}
                onTimeUpdate={handleTimeUpdate} // Keep for paused state updates
            />

            {/* STATE 1: Initial - centered play prompt */}
            {!isPlaying && (
                <div className="player-intro-overlay">
                    <div className="player-intro-box">
                        <div className="player-intro-title">♪ Welcome & Goodbye ♪</div>
                        {!isLoaded ? (
                            <div className="player-loading-container">
                                <div className="player-loading-bar" style={{ width: `${loadingProgress}%` }}></div>
                                <div className="player-loading-text">{Math.floor(loadingProgress)}%</div>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="player-intro-play"
                                    style={{ borderColor: getStatusColor() }}
                                    onClick={togglePlay}
                                >
                                    <div className="player-intro-play-icon"></div>
                                </button>
                                <div className="player-intro-hint">CLICK TO PLAY</div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* STATE 2: Playing - mini bar + floating lyrics */}
            {isPlaying && (
                <>
                    {/* Mini player bar - Hide ONLY in the final sunny scene (when flowers are out) */}
                    {!(weather === 'none' && showFlower) && (
                        <div className="player-mini-bar" onClick={togglePlay}>
                            <span className="player-mini-icon playing">
                                <span className="bar b1"></span>
                                <span className="bar b2"></span>
                                <span className="bar b3"></span>
                            </span>
                            <span className="player-mini-title">Welcome & Goodbye</span>
                            <span className="player-mini-pause">II</span>
                        </div>
                    )}

                    {/* Floating lyric line */}
                    {visualLyric && (
                        <div className="lyric-float" key={visualLyric.sourceIndex}>
                            {visualLyric.text}
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default AudioPlayer;
