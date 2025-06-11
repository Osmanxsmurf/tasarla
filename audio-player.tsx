import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Slider } from "./slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Repeat,
  Shuffle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  title: string;
  artist: string;
  albumArt?: string;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export function AudioPlayer({
  src,
  title,
  artist,
  albumArt,
  onEnded,
  onNext,
  onPrevious,
  className
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Update audio when src changes
  useEffect(() => {
    if (audioRef.current) {
      // Reset state
      setCurrentTime(0);
      setDuration(0);
      setPlaying(false);
      
      // Load new audio
      audioRef.current.load();
      
      // Auto play when new track is loaded
      audioRef.current.play().then(() => {
        setPlaying(true);
      }).catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  }, [src]);
  
  // Update time display
  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    };
    
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setPlaying(!playing);
    }
  };
  
  // Format time display (e.g., 2:30)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  
  // İkon başlıkları
  const iconLabels = {
    shuffle: "Karıştır",
    previous: "Önceki",
    play: "Oynat",
    pause: "Duraklat",
    next: "Sonraki",
    repeat: "Tekrarla",
    mute: "Sessiz",
    unmute: "Sesi Aç"
  };
  
  // Handle seek
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      const newVolume = value[0];
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setMuted(newVolume === 0);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };
  
  // Handle repeat toggle
  const toggleRepeat = () => {
    if (audioRef.current) {
      audioRef.current.loop = !repeat;
      setRepeat(!repeat);
    }
  };
  
  // Handle shuffle toggle
  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };
  
  return (
    <div className={cn("w-full bg-dark-200 p-3 rounded-lg", className)}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        onEnded={onEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration || 0)}
      />
      
      {/* Track info and controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {albumArt && (
            <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
              <img src={albumArt} alt={`${title} by ${artist}`} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h4 className="font-medium text-white truncate">{title}</h4>
            <p className="text-sm text-gray-400 truncate">{artist}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleShuffle}
            className={cn("text-gray-400 hover:text-white", shuffle && "text-primary")}
            title={iconLabels.shuffle}
          >
            <Shuffle size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="text-gray-400 hover:text-white"
            disabled={!onPrevious}
            title={iconLabels.previous}
          >
            <SkipBack size={20} />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            className="bg-white text-black hover:bg-gray-200 h-8 w-8 rounded-full"
            title={playing ? iconLabels.pause : iconLabels.play}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="text-gray-400 hover:text-white"
            disabled={!onNext}
            title={iconLabels.next}
          >
            <SkipForward size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRepeat}
            className={cn("text-gray-400 hover:text-white", repeat && "text-primary")}
            title={iconLabels.repeat}
          >
            <Repeat size={18} />
          </Button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
        
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="flex-1"
        />
        
        <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
      </div>
      
      {/* Volume control */}
      <div className="flex items-center mt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="text-gray-400 hover:text-white"
          title={muted ? iconLabels.unmute : iconLabels.mute}
        >
          {muted || volume === 0 ? (
            <VolumeX size={18} />
          ) : volume < 0.5 ? (
            <Volume1 size={18} />
          ) : (
            <Volume2 size={18} />
          )}
        </Button>
        
        <Slider
          value={[muted ? 0 : volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-24 ml-2"
        />
      </div>
    </div>
  );
}
