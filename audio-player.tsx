import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AudioVisualizer } from '@/components/ui/visualizer';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Volume1, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Heart 
} from 'lucide-react';
import { Song } from '@shared/schema';
import { useAudio } from '@/hooks/use-audio';
import { useSwipe } from '@/hooks/use-swipe';

interface AudioPlayerProps {
  song: Song;
  onNext?: () => void;
  onPrevious?: () => void;
  onEnded?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  className?: string;
  showArtwork?: boolean;
  compact?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  song,
  onNext,
  onPrevious,
  onEnded,
  onLike,
  isLiked = false,
  className,
  showArtwork = true,
  compact = false
}) => {
  const {
    playerState,
    duration,
    currentTime,
    volume,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    changeVolume
  } = useAudio();
  
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isVisualizerActive, setIsVisualizerActive] = useState(true);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Format time as minutes:seconds
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle swipe gestures for mobile
  useSwipe(playerRef, {
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
  });
  
  // Toggle volume control visibility
  const toggleVolumeControl = () => {
    setShowVolumeControl(prev => !prev);
  };
  
  // Display the appropriate volume icon based on level
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={compact ? 18 : 20} />;
    if (volume < 0.5) return <Volume1 size={compact ? 18 : 20} />;
    return <Volume2 size={compact ? 18 : 20} />;
  };
  
  return (
    <div 
      ref={playerRef}
      className={cn(
        'w-full bg-card border-t border-muted flex flex-col',
        className
      )}
    >
      {/* Hidden audio element for the audio hook */}
      <audio
        ref={audioRef}
        src={song.audioUrl}
        onEnded={onEnded}
        className="hidden"
      />
      
      {/* Visualizer */}
      {isVisualizerActive && (
        <div className="h-1 overflow-hidden">
          <AudioVisualizer 
            playing={playerState === 'playing'} 
            audioRef={audioRef}
          />
        </div>
      )}
      
      {/* Playback progress */}
      <div className="px-4 pt-1">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={(values) => seekTo(values[0])}
          className="h-1"
        />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 0)}</span>
        </div>
      </div>
      
      {/* Main player controls */}
      <div className={cn(
        'px-4 pb-3 pt-1 flex items-center',
        compact ? 'gap-2' : 'gap-4'
      )}>
        {showArtwork && (
          <div className={cn(
            'bg-muted rounded overflow-hidden flex-shrink-0',
            compact ? 'w-10 h-10' : 'w-12 h-12'
          )}>
            <img 
              src={song.coverImage || 'https://placehold.co/200/gray/white?text=No+Image'} 
              alt={`${song.title} by ${song.artist}`} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className={cn(
          'flex-1 min-w-0',
          !showArtwork && 'ml-0'
        )}>
          <h4 className="font-medium truncate text-sm">{song.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
        
        <div className={cn(
          'flex items-center',
          compact ? 'gap-1' : 'gap-2'
        )}>
          {!compact && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground transition-colors h-8 w-8"
              onClick={onPrevious}
            >
              <SkipBack size={18} />
            </Button>
          )}
          
          <Button
            variant={compact ? "ghost" : "primary"}
            size="icon"
            className={cn(
              compact ? "text-muted-foreground hover:text-foreground h-8 w-8" : "h-10 w-10 rounded-full"
            )}
            onClick={togglePlayPause}
          >
            {playerState === 'playing' ? (
              <Pause size={compact ? 18 : 20} />
            ) : (
              <Play size={compact ? 18 : 20} />
            )}
          </Button>
          
          {!compact && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground transition-colors h-8 w-8"
              onClick={onNext}
            >
              <SkipForward size={18} />
            </Button>
          )}
          
          {!compact && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors h-8 w-8",
                isLiked && "text-red-500 hover:text-red-600"
              )}
              onClick={onLike}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </Button>
          )}
          
          {!compact && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground transition-colors h-8 w-8"
                onClick={toggleVolumeControl}
              >
                <VolumeIcon />
              </Button>
              
              {showVolumeControl && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-popover border rounded-lg shadow-md w-32 z-50">
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(values) => changeVolume(values[0] / 100)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
