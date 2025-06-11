import React, { useEffect, useState } from "react";
import { AudioPlayer } from "@/components/ui/audio-player";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { usePlayerContext } from "@/context/player-context";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addFavorite, removeFavorite, addPlayHistory } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";

export function MusicPlayer() {
  const { toast } = useToast();
  const { 
    currentTrack, 
    queue, 
    playNextTrack, 
    playPreviousTrack,
    isAuthenticated 
  } = usePlayerContext();
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Query to check if track is favorite
  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated && !!currentTrack,
    staleTime: 10000, // 10 seconds
  });
  
  // Mutation for adding to favorites
  const addToFavoritesMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${currentTrack?.title} has been added to your favorites`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add to favorites",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  // Mutation for removing from favorites
  const removeFromFavoritesMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: `${currentTrack?.title} has been removed from your favorites`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove from favorites",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  // Mutation for adding to play history
  const addToHistoryMutation = useMutation({
    mutationFn: addPlayHistory,
  });
  
  // Check if the current track is in favorites
  useEffect(() => {
    if (currentTrack && favorites) {
      const found = favorites.some((favorite: any) => 
        favorite.trackId === currentTrack.id
      );
      setIsFavorite(found);
    } else {
      setIsFavorite(false);
    }
  }, [currentTrack, favorites]);
  
  // Add to play history when track changes
  useEffect(() => {
    if (currentTrack && isAuthenticated) {
      addToHistoryMutation.mutate({
        trackId: currentTrack.id,
        title: currentTrack.title,
        artist: currentTrack.artist,
        albumArt: currentTrack.thumbnail,
        source: currentTrack.source,
      });
    }
  }, [currentTrack, isAuthenticated]);
  
  // Toggle favorite
  const toggleFavorite = () => {
    if (!isAuthenticated || !currentTrack) return;
    
    if (isFavorite) {
      removeFromFavoritesMutation.mutate(currentTrack.id);
    } else {
      addToFavoritesMutation.mutate({
        trackId: currentTrack.id,
        title: currentTrack.title,
        artist: currentTrack.artist,
        albumArt: currentTrack.thumbnail,
        source: currentTrack.source,
      });
    }
  };
  
  if (!currentTrack) {
    return null;
  }
  
  // For YouTube tracks, generate an embed URL
  const audioSrc = currentTrack.source === 'youtube' 
    ? getYouTubeEmbedUrl(currentTrack.id)
    : currentTrack.url;
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-dark-200 border-t border-dark-100 py-3 px-4 z-40">
      <div className="flex items-center">
        {/* Track Info */}
        <div className="flex items-center w-1/4 min-w-[180px]">
          <div className="h-12 w-12 rounded overflow-hidden mr-3 flex-shrink-0">
            {currentTrack.thumbnail ? (
              <img 
                src={currentTrack.thumbnail} 
                alt={`${currentTrack.title} by ${currentTrack.artist}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-dark-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-light-300" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            )}
          </div>
          <div className="overflow-hidden mr-4">
            <h4 className="font-medium truncate">{currentTrack.title}</h4>
            <p className="text-sm text-light-300 truncate">{currentTrack.artist}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFavorite}
            className="text-light-300 hover:text-primary hidden md:block"
            disabled={!isAuthenticated}
          >
            <Heart className={cn(isFavorite && "fill-primary text-primary")} size={18} />
          </Button>
        </div>
        
        {/* Player Controls */}
        <div className="flex-1 max-w-2xl mx-auto">
          <AudioPlayer 
            src={audioSrc}
            title={currentTrack.title}
            artist={currentTrack.artist}
            albumArt={currentTrack.thumbnail}
            onNext={queue.length > 0 ? playNextTrack : undefined}
            onPrevious={playPreviousTrack}
            onEnded={playNextTrack}
          />
        </div>
        
        {/* Extra Space for Balance */}
        <div className="hidden md:block w-1/4">
          {/* This is an empty space to balance the layout */}
        </div>
      </div>
    </footer>
  );
}
