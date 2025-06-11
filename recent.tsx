import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "wouter";
import { SearchItem } from "@/components/search-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlayerContext } from "@/context/player-context";
import { useAuth } from "@/context/auth-context";
import { History, Music } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Recent() {
  const [_, navigate] = useNavigate();
  const { isAuthenticated } = useAuth();
  const { playTrack } = usePlayerContext();
  
  // Fetch play history
  const { 
    data: playHistory, 
    isLoading,
    isError,
    error 
  } = useQuery({
    queryKey: ["/api/history"],
    enabled: isAuthenticated,
  });
  
  // Handle track play
  const handlePlayTrack = (track: any) => {
    playTrack({
      id: track.trackId,
      title: track.title,
      artist: track.artist,
      thumbnail: track.albumArt,
      source: track.source
    });
  };
  
  // Format play time
  const formatPlayTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <History className="h-16 w-16 text-light-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">Sign in to view your play history</h3>
          <p className="text-light-300 max-w-md mb-4">
            Create an account or sign in to track your listening activity and get personalized recommendations.
          </p>
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
            className="bg-primary hover:bg-primary/90"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold mb-2">Recently Played</h1>
        <p className="text-light-300">Your listening history from the past 30 days.</p>
      </div>
      
      {isLoading ? (
        // Loading state
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-dark-100 p-4 rounded-lg">
              <div className="flex items-center">
                <Skeleton className="h-16 w-16 bg-dark-200 rounded-md mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 bg-dark-200 rounded w-3/4 mb-2" />
                  <Skeleton className="h-3 bg-dark-200 rounded w-1/2" />
                </div>
                <Skeleton className="h-4 w-16 bg-dark-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        // Error state
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg viewBox="0 0 24 24" className="h-16 w-16 text-destructive mb-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
          <p className="text-light-300 max-w-md mb-4">
            {(error as any)?.message || "We couldn't load your play history. Please try again later."}
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/history"] })}
            className="bg-primary hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      ) : playHistory && playHistory.length > 0 ? (
        // Play history list
        <div className="space-y-2">
          {playHistory.map((item: any) => (
            <div 
              key={item.id} 
              className="bg-dark-100 p-4 rounded-lg hover:bg-dark-100/80 transition-colors cursor-pointer"
              onClick={() => handlePlayTrack(item)}
            >
              <div className="flex items-center">
                <div className="h-16 w-16 rounded overflow-hidden mr-4 flex-shrink-0">
                  {item.albumArt ? (
                    <img 
                      src={item.albumArt} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-dark-200 flex items-center justify-center">
                      <Music className="text-light-300" size={24} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <p className="text-sm text-light-300 truncate">{item.artist}</p>
                </div>
                
                <div className="text-sm text-light-300 ml-4">
                  {formatPlayTime(item.playedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <History className="h-16 w-16 text-light-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No listening history yet</h3>
          <p className="text-light-300 max-w-md mb-4">
            You haven't played any tracks yet. Start exploring music to build your listening history.
          </p>
          <Button 
            onClick={() => navigate("/search")}
            className="bg-primary hover:bg-primary/90"
          >
            Discover Music
          </Button>
        </div>
      )}
    </div>
  );
}
