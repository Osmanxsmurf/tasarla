import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/hooks/use-player";

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffling,
    isRepeating,
    toggle,
    seekTo,
    setVolume,
    previousTrack,
    nextTrack,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  } = usePlayer();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (value: number[]) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Currently Playing */}
        <div className="flex items-center space-x-4 w-1/4 min-w-0">
          <img
            src={currentTrack.imageUrl || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
            alt={`${currentTrack.title} by ${currentTrack.artist}`}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-white truncate">{currentTrack.title}</h4>
            <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 rounded-full transition-colors ${
              currentTrack.isLiked ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-red-400"
            }`}
            onClick={toggleLike}
          >
            <i className="fas fa-heart text-sm" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 w-1/2">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 rounded-full transition-colors ${
                isShuffling ? "text-green-400" : "text-gray-400 hover:text-white"
              }`}
              onClick={toggleShuffle}
            >
              <i className="fas fa-random text-sm" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full text-gray-400 hover:text-white transition-colors"
              onClick={previousTrack}
            >
              <i className="fas fa-step-backward" />
            </Button>

            <Button
              size="sm"
              className="w-12 h-12 bg-white hover:bg-gray-100 text-black rounded-full transition-all hover:scale-105"
              onClick={toggle}
            >
              <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"} text-lg`} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full text-gray-400 hover:text-white transition-colors"
              onClick={nextTrack}
            >
              <i className="fas fa-step-forward" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 rounded-full transition-colors ${
                isRepeating ? "text-green-400" : "text-gray-400 hover:text-white"
              }`}
              onClick={toggleRepeat}
            >
              <i className="fas fa-redo text-sm" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-3 w-full max-w-md">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleProgressChange}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume & Additional Controls */}
        <div className="flex items-center space-x-3 w-1/4 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-list text-sm" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-desktop text-sm" />
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-volume-up text-sm" />
            </Button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
