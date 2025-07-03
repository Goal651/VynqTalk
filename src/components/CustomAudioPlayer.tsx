import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface CustomAudioPlayerProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
}

export const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
    src,
    className = "",
    style = {},
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [waveform, setWaveform] = useState<number[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    // Draw waveform on canvas
    useEffect(() => {
        if (!src) return;
        const drawWaveform = async () => {
            try {
                const response = await fetch(src);
                const arrayBuffer = await response.arrayBuffer();
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                // Downsample for performance
                const rawData = audioBuffer.getChannelData(0);
                const samples = 200; // Number of bars
                const blockSize = Math.floor(rawData.length / samples);
                const waveformData: number[] = [];
                for (let i = 0; i < samples; i++) {
                    let sum = 0;
                    for (let j = 0; j < blockSize; j++) {
                        sum += Math.abs(rawData[i * blockSize + j]);
                    }
                    waveformData.push(sum / blockSize);
                }
                setWaveform(waveformData);
            } catch (err) {
                setWaveform([]);
            }
        };
        drawWaveform();
    }, [src]);

    // Render waveform to canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || waveform.length === 0) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const width = canvas.width;
        const height = canvas.height;
        const barWidth = width / waveform.length;
        ctx.fillStyle = "#6366f1";
        waveform.forEach((amp, i) => {
            const barHeight = amp * height;
            ctx.fillRect(i * barWidth, (height - barHeight) / 2, barWidth, barHeight);
        });
    }, [waveform, currentTime]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (audioRef.current.paused) {
            audioRef.current.play();
            setPlaying(true);
        } else {
            audioRef.current.pause();
            setPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (!audioRef.current) return;
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;
        const time = Number(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;
        const vol = Number(e.target.value);
        audioRef.current.volume = vol;
        setVolume(vol);
        setMuted(vol === 0);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !muted;
        setMuted(!muted);
    };

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        switch (e.key) {
            case " ":
            case "Spacebar":
                e.preventDefault();
                togglePlay();
                break;
            case "ArrowLeft":
                e.preventDefault();
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
                setCurrentTime(audioRef.current.currentTime);
                break;
            case "ArrowRight":
                e.preventDefault();
                audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
                setCurrentTime(audioRef.current.currentTime);
                break;
            case "ArrowUp":
                e.preventDefault();
                audioRef.current.volume = Math.min(1, audioRef.current.volume + 0.1);
                setVolume(audioRef.current.volume);
                setMuted(audioRef.current.volume === 0);
                break;
            case "ArrowDown":
                e.preventDefault();
                audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.1);
                setVolume(audioRef.current.volume);
                setMuted(audioRef.current.volume === 0);
                break;
            case "m":
            case "M":
                e.preventDefault();
                toggleMute();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (!audioRef.current) return;
        setVolume(audioRef.current.volume);
        setMuted(audioRef.current.muted);
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
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
                tabIndex={-1}
                style={{ display: "none" }}
            />
            {/* Waveform */}
            <canvas
                ref={canvasRef}
                width={400}
                height={48}
                className="w-full h-12 bg-black"
                style={{ display: "block" }}
                onClick={e => {
                    if (!audioRef.current || !canvasRef.current) return;
                    const rect = canvasRef.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percent = x / rect.width;
                    const seekTime = percent * duration;
                    audioRef.current.currentTime = seekTime;
                    setCurrentTime(seekTime);
                }}
            />
            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 p-2 flex items-center gap-2">
                {/* Play/Pause */}
                <button
                    onClick={togglePlay}
                    className="text-white hover:text-primary"
                    aria-label={playing ? "Pause" : "Play"}
                    type="button"
                >
                    {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                {/* Time */}
                <span className="text-xs text-white/80 min-w-[60px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                {/* Seek bar */}
                <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-32 accent-primary"
                />
                {/* Volume */}
                <button
                    onClick={toggleMute}
                    className="text-white hover:text-primary"
                    aria-label={muted ? "Unmute" : "Mute"}
                    type="button"
                >
                    {muted || volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                    ) : (
                        <Volume2 className="w-4 h-4" />
                    )}
                </button>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={handleVolume}
                    className="w-16 accent-primary"
                />
            </div>
        </div>
    );
}; 