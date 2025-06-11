import { useRef, useState, useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Heart, Play, Pause, SkipBack, SkipForward, Volume2, List, Repeat, Shuffle, Speaker } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatTime } from "@/lib/utils";

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    resumeTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    setVolume,
    setProgress,
    toggleLike,
    isTrackLiked
  } = usePlayer();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // Calculate time from progress
  useEffect(() => {
    if (duration) {
      setCurrentTime((progress / 100) * duration);
      setTotalDuration(duration);
    }
  }, [progress, duration]);
  
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseInt(e.target.value));
  };
  
  const handleLike = () => {
    if (currentTrack) {
      toggleLike(currentTrack);
    }
  };
  
  // If no track is playing, hide player or show minimal version
  if (!currentTrack) {
    return null;
  }
  
  const isLiked = currentTrack.id ? isTrackLiked(currentTrack.id) : false;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-16 md:h-20 z-40 flex items-center px-4 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center w-1/4 md:w-1/5 pr-2">
        <div className="h-10 w-10 md:h-14 md:w-14 flex-shrink-0 bg-muted rounded-md overflow-hidden">
          <img 
            src={currentTrack.coverImage || "https://placehold.co/100x100/333/FFF?text=MüzikAI"} 
            alt={`${currentTrack.title} - ${currentTrack.artist}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="ml-3 truncate">
          <h4 className="text-sm font-medium truncate">{currentTrack.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
        <button 
          className={cn(
            "ml-2 md:ml-4",
            isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={handleLike}
        >
          <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
        </button>
      </div>
      
      <div className="flex flex-col justify-center flex-1 px-4 md:px-8">
        <div className="flex items-center justify-center space-x-4 mb-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition">
                  <Shuffle className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Karıştır</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <button
            className="text-muted-foreground hover:text-foreground transition"
            onClick={previousTrack}
          >
            <SkipBack className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          
          <button
            className="bg-primary text-primary-foreground rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-opacity-90 transition"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-1" />
            )}
          </button>
          
          <button
            className="text-muted-foreground hover:text-foreground transition"
            onClick={nextTrack}
          >
            <SkipForward className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition">
                  <Repeat className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tekrarla</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground w-full">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <div className="mx-3 flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer music-progress"
            />
          </div>
          <span className="w-10">{formatTime(totalDuration)}</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center w-1/5 justify-end space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition">
                <List className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Çalma Listesi</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition">
                <Speaker className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cihazlar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center">
          <Volume2 className="text-muted-foreground h-5 w-5 mr-2" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer volume-slider"
          />
        </div>
      </div>
    </div>
  );
}
