import React, { useRef, useState, useEffect, KeyboardEvent } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

interface CustomVideoPlayerProps {
    src: string;
    poster?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
    src,
    poster,
    className = "",
    style = {},
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setPlaying(true);
        } else {
            videoRef.current.pause();
            setPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const time = Number(e.target.value);
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const vol = Number(e.target.value);
        videoRef.current.volume = vol;
        setVolume(vol);
        setMuted(vol === 0);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !muted;
        setMuted(!muted);
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;
        switch (e.key) {
            case " ": // Spacebar
            case "Spacebar":
                e.preventDefault();
                togglePlay();
                break;
            case "ArrowLeft":
                e.preventDefault();
                videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                setCurrentTime(videoRef.current.currentTime);
                break;
            case "ArrowRight":
                e.preventDefault();
                videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
                setCurrentTime(videoRef.current.currentTime);
                break;
            case "ArrowUp":
                e.preventDefault();
                videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
                setVolume(videoRef.current.volume);
                setMuted(videoRef.current.volume === 0);
                break;
            case "ArrowDown":
                e.preventDefault();
                videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
                setVolume(videoRef.current.volume);
                setMuted(videoRef.current.volume === 0);
                break;
            case "m":
            case "M":
                e.preventDefault();
                toggleMute();
                break;
            case "f":
            case "F":
                e.preventDefault();
                handleFullscreen();
                break;
            default:
                break;
        }
    };

    // Keep volume/mute state in sync with video element
    useEffect(() => {
        if (!videoRef.current) return;
        setVolume(videoRef.current.volume);
        setMuted(videoRef.current.muted);
    }, []);

    return (
        <div
            className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
            style={style}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-auto"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
                tabIndex={-1}
                style={{ background: "#000" }}
            />
            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 p-3 flex flex-col gap-2">
                {/* Seek bar */}
                <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-primary"
                />
                <div className="flex items-center justify-between gap-3">
                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        className="text-white hover:text-primary"
                        aria-label={playing ? "Pause" : "Play"}
                        type="button"
                    >
                        {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    {/* Time */}
                    <span className="text-xs text-white/80 min-w-[60px]">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    {/* Volume */}
                    <button
                        onClick={toggleMute}
                        className="text-white hover:text-primary"
                        aria-label={muted ? "Unmute" : "Mute"}
                        type="button"
                    >
                        {muted || volume === 0 ? (
                            <VolumeX className="w-5 h-5" />
                        ) : (
                            <Volume2 className="w-5 h-5" />
                        )}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={muted ? 0 : volume}
                        onChange={handleVolume}
                        className="w-20 accent-primary"
                    />
                    {/* Fullscreen */}
                    <button
                        onClick={handleFullscreen}
                        className="text-white hover:text-primary"
                        aria-label="Fullscreen"
                        type="button"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}; 