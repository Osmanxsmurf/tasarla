import React, { useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Shuffle, 
  Repeat, 
  Heart,
  List,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useMusic } from '@/contexts/music-context';

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    seekTo,
  } = useMusic();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  // Calculate current time based on progress and duration
  const currentTime = currentSong ? (progress / 100) * currentSong.duration : 0;

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-100/95 backdrop-blur-md border-t border-gray-800 p-4 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Current Song Info */}
          <div className="flex items-center space-x-4 flex-1">
            <img 
              src={currentSong.thumbnail}
              alt={`${currentSong.title} artwork`}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-semibold text-sm text-white" title={currentSong.title}>
                {currentSong.title.length > 30 
                  ? `${currentSong.title.substring(0, 30)}...` 
                  : currentSong.title
                }
              </h4>
              <p className="text-gray-400 text-xs" title={currentSong.artist}>
                {currentSong.artist.length > 25 
                  ? `${currentSong.artist.substring(0, 25)}...` 
                  : currentSong.artist
                }
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Heart className="h-4 w-4 text-gray-400 hover:text-red-400" />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex-1 max-w-md mx-8">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Shuffle className="h-4 w-4 text-gray-400 hover:text-white" />
              </Button>
              
              <Button
                onClick={playPrevious}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <SkipBack className="h-5 w-5 text-white" />
              </Button>
              
              <Button
                onClick={togglePlay}
                className="bg-primary hover:bg-primary/90 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="text-white h-5 w-5" fill="currentColor" />
                ) : (
                  <Play className="text-white h-5 w-5 ml-0.5" fill="currentColor" />
                )}
              </Button>
              
              <Button
                onClick={playNext}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <SkipForward className="h-5 w-5 text-white" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Repeat className="h-4 w-4 text-gray-400 hover:text-white" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span className="w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1">
                <Slider
                  value={[progress]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <span className="w-10">
                {formatTime(currentSong.duration)}
              </span>
            </div>
          </div>

          {/* Volume and Additional Controls */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <List className="h-4 w-4 text-gray-400 hover:text-white" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Volume2 className="h-4 w-4 text-gray-400 hover:text-white" />
              </Button>
              <div className="w-20">
                <Slider
                  value={[volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                />
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Maximize2 className="h-4 w-4 text-gray-400 hover:text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
