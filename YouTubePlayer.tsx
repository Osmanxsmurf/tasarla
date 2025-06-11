import React, { useState, useEffect, useRef } from 'react';
import { Song } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Heart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { AudioVisualizer } from '@/components/ui/visualizer';

// Embedding ID extractor
function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return (match && match[1]) || null;
}

// For creating safe song search queries
function createSearchQuery(song: Song): string {
  return `${song.artist} - ${song.title} official audio`;
}

interface YouTubePlayerProps {
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

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<YT.Player | null>(null);
  const playerDivId = `youtube-player-${song.id}`;
  const progressInterval = useRef<number | null>(null);

  // Format time as minutes:seconds
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!youtubePlayerRef.current) return;
    
    try {
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
    } catch (err) {
      console.error('Error toggling play/pause:', err);
    }
  };

  // Set up YouTube player
  useEffect(() => {
    // Reset player state for new song
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setError(null);
    setYoutubeId(null);
    
    // Clean up old player
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.destroy();
      } catch (err) {
        console.error('Error destroying player:', err);
      }
      youtubePlayerRef.current = null;
    }
    
    // Clear progress update interval
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    
    // Extract YouTube ID from URL if available or try to search
    if (song.youtubeId) {
      setYoutubeId(song.youtubeId);
    } else if (song.youtubeUrl) {
      const id = extractYouTubeId(song.youtubeUrl);
      setYoutubeId(id);
    } 
    
    if (!window.YT) {
      // If YouTube API isn't loaded, load it
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // This function will be called once the API is ready
      (window as any).onYouTubeIframeAPIReady = () => {
        setPlayerReady(true);
      };
    } else {
      setPlayerReady(true);
    }
  }, [song.id, song.youtubeId, song.youtubeUrl]);
  
  // Initialize YouTube player once we have an ID and the API is ready
  useEffect(() => {
    if (!youtubeId || !playerReady || !playerContainerRef.current) return;
    
    // Check if player container exists
    const playerContainer = document.getElementById(playerDivId);
    if (!playerContainer) {
      const div = document.createElement('div');
      div.id = playerDivId;
      div.style.width = '100%';
      div.style.height = '100%';
      div.style.position = 'absolute';
      div.style.top = '0';
      div.style.left = '0';
      div.style.opacity = '0';
      div.style.pointerEvents = 'none';
      playerContainerRef.current.appendChild(div);
    }
    
    try {
      youtubePlayerRef.current = new window.YT.Player(playerDivId, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volume);
            setDuration(event.target.getDuration());
            setIsLoading(false);
            // Start the progress updater
            progressInterval.current = window.setInterval(() => {
              try {
                const currentTime = event.target.getCurrentTime() || 0;
                setCurrentTime(currentTime);
              } catch (err) {
                console.error('Error updating progress:', err);
              }
            }, 1000);
          },
          onStateChange: (event) => {
            // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued
            switch (event.data) {
              case YT.PlayerState.PLAYING:
                setIsPlaying(true);
                setIsLoading(false);
                break;
              case YT.PlayerState.PAUSED:
                setIsPlaying(false);
                setIsLoading(false);
                break;
              case YT.PlayerState.BUFFERING:
                setIsLoading(true);
                break;
              case YT.PlayerState.ENDED:
                setIsPlaying(false);
                if (onEnded) onEnded();
                break;
            }
          },
          onError: (event) => {
            setError(`YouTube Error: ${event.data}`);
            setIsLoading(false);
          }
        }
      });
    } catch (err) {
      console.error('Error creating YouTube player:', err);
      setError('Failed to create YouTube player');
      setIsLoading(false);
    }
    
    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
      
      try {
        if (youtubePlayerRef.current) {
          youtubePlayerRef.current.destroy();
        }
      } catch (err) {
        console.error('Error cleaning up YouTube player:', err);
      }
    };
  }, [youtubeId, playerReady, onEnded, volume]);
  
  // Seek to specific time
  const seekTo = (time: number) => {
    if (!youtubePlayerRef.current) return;
    
    try {
      youtubePlayerRef.current.seekTo(time, true);
    } catch (err) {
      console.error('Error seeking:', err);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    if (!youtubePlayerRef.current) return;
    
    try {
      const vol = newVolume[0];
      setVolume(vol);
      youtubePlayerRef.current.setVolume(vol);
    } catch (err) {
      console.error('Error changing volume:', err);
    }
  };
  
  // Toggle volume control visibility
  const toggleVolumeControl = () => {
    setShowVolumeControl(prev => !prev);
  };
  
  // Display appropriate volume icon
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={compact ? 18 : 20} />;
    if (volume < 50) return <Volume1 size={compact ? 18 : 20} />;
    return <Volume2 size={compact ? 18 : 20} />;
  };
  
  return (
    <div className={cn('w-full bg-card border-t border-muted flex flex-col', className)}>
      {/* Hidden player container */}
      <div 
        ref={playerContainerRef}
        className="w-1 h-1 overflow-hidden opacity-0 absolute pointer-events-none"
      ></div>
      
      {/* Visualizer */}
      <div className="h-1 overflow-hidden">
        <AudioVisualizer playing={isPlaying} bars={30} height={4} />
      </div>
      
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
      
      {/* Player controls */}
      <div className={cn('px-4 pb-3 pt-1 flex items-center', compact ? 'gap-2' : 'gap-4')}>
        {showArtwork && (
          <div className={cn('bg-muted rounded overflow-hidden flex-shrink-0', compact ? 'w-10 h-10' : 'w-12 h-12')}>
            <img 
              src={song.coverImage || 'https://placehold.co/200/gray/white?text=No+Image'} 
              alt={`${song.title} by ${song.artist}`} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className={cn('flex-1 min-w-0', !showArtwork && 'ml-0')}>
          <h4 className="font-medium truncate text-sm">{song.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
          {error && <p className="text-xs text-red-500 truncate">{error}</p>}
        </div>
        
        <div className={cn('flex items-center', compact ? 'gap-1' : 'gap-2')}>
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
              compact ? "text-muted-foreground hover:text-foreground h-8 w-8" : "h-10 w-10 rounded-full",
              isLoading && "opacity-50"
            )}
            onClick={togglePlayPause}
            disabled={isLoading || !!error}
          >
            {isPlaying ? <Pause size={compact ? 18 : 20} /> : <Play size={compact ? 18 : 20} />}
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
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
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