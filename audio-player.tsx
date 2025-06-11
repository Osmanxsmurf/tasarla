import React, { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Slider } from './slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  className?: string;
}

export function AudioPlayer({
  src,
  autoPlay = false,
  onPlay,
  onPause,
  onEnd,
  className,
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!src) return;
    
    // Clean up previous sound
    if (soundRef.current) {
      soundRef.current.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    setLoading(true);
    setError(null);
    
    // Create new Howl instance with error handling
    try {
      const sound = new Howl({
        src: [src],
        html5: true,
        volume: volume,
        mute: muted,
        onload: () => {
          setDuration(sound.duration());
          setLoading(false);
          if (autoPlay) {
            try {
              sound.play();
              setPlaying(true);
              if (onPlay) onPlay();
              startTimeTracking();
            } catch (error) {
              console.error("Error playing audio:", error);
              setError('Ses dosyası oynatılamıyor');
              setLoading(false);
            }
          }
        },
        onplay: () => {
          setPlaying(true);
          if (onPlay) onPlay();
          startTimeTracking();
        },
        onpause: () => {
          setPlaying(false);
          if (onPause) onPause();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        },
        onstop: () => {
          setPlaying(false);
          setCurrentTime(0);
          if (onPause) onPause();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        },
        onend: () => {
          setPlaying(false);
          setCurrentTime(0);
          if (onEnd) onEnd();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        },
        onloaderror: () => {
          console.error("Error loading audio:", src);
          setLoading(false);
          setError('Ses dosyası yüklenemedi');
        },
        onplayerror: (id, error) => {
          console.error("Error playing audio:", error);
          setLoading(false);
          setError('Ses dosyası oynatılamıyor');
          // Try to unlock audio on iOS
          sound.once('unlock', () => {
            try {
              sound.play();
            } catch (e) {
              console.error("Error on unlock:", e);
            }
          });
        },
      });
      
      soundRef.current = sound;
    } catch (error) {
      console.error("Error creating Howl instance:", error);
      setLoading(false);
      setError('Ses oynatıcı oluşturulamadı');
    }
    
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [src, autoPlay, onPlay, onPause, onEnd]);
  
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);
  
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.mute(muted);
    }
  }, [muted]);
  
  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (soundRef.current) {
        setCurrentTime(soundRef.current.seek());
      }
    }, 1000);
  };
  
  const handlePlayPause = () => {
    if (!soundRef.current) return;
    
    if (playing) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (!soundRef.current) return;
    
    const newPosition = value[0];
    soundRef.current.seek(newPosition);
    setCurrentTime(newPosition);
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (muted && newVolume > 0) {
      setMuted(false);
    }
  };
  
  const handleMuteToggle = () => {
    setMuted(!muted);
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center text-red-500 p-4 gap-2", className)}>
        <div>{error}</div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setError(null)}
          className="text-xs"
        >
          Tekrar Dene
        </Button>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="flex items-center justify-center gap-4 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {/* Previous track logic */}}
          disabled={loading}
          className="text-muted-foreground hover:text-foreground"
        >
          <SkipBack size={18} />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          onClick={handlePlayPause}
          disabled={loading}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : playing ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="ml-0.5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {/* Next track logic */}}
          disabled={loading}
          className="text-muted-foreground hover:text-foreground"
        >
          <SkipForward size={18} />
        </Button>
      </div>
      
      <div className="w-full flex items-center gap-2">
        <span className="text-xs text-muted-foreground min-w-[40px]">
          {formatTime(currentTime)}
        </span>
        
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          disabled={loading || duration === 0}
          className="flex-1"
        />
        
        <span className="text-xs text-muted-foreground min-w-[40px]">
          {formatTime(duration)}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMuteToggle}
          className="text-muted-foreground hover:text-foreground"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
        
        <Slider
          value={[muted ? 0 : volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  );
}
