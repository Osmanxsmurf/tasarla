import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SearchItem } from "@/components/search-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { usePlayerContext } from "@/context/player-context";
import { useAuth } from "@/context/auth-context";
import { queryClient } from "@/lib/queryClient";
import { removeFavorite } from "@/lib/api";
import { Heart, Trash2, Music } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Favorites() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { playTrack } = usePlayerContext();
  
  // Fetch favorites
  const { 
    data: favorites, 
    isLoading,
    isError,
    error 
  } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });
  
  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "Track has been removed from your favorites",
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
  
  // Handle remove from favorites
  const handleRemoveFromFavorites = (trackId: string) => {
    removeFromFavoritesMutation.mutate(trackId);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-16 w-16 text-light-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">Sign in to view your favorites</h3>
          <p className="text-light-300 max-w-md mb-4">
            Create an account or sign in to save your favorite tracks and access them from any device.
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
        <h1 className="text-3xl font-heading font-bold mb-2">Your Favorites</h1>
        <p className="text-light-300">All the tracks you've added to your favorites collection.</p>
      </div>
      
      {isLoading ? (
        // Loading state
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-dark-100 p-4 rounded-lg">
              <Skeleton className="aspect-square bg-dark-200 rounded-md mb-3" />
              <Skeleton className="h-4 bg-dark-200 rounded w-3/4 mb-2" />
              <Skeleton className="h-3 bg-dark-200 rounded w-1/2" />
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
            {(error as any)?.message || "We couldn't load your favorites. Please try again later."}
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/favorites"] })}
            className="bg-primary hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      ) : favorites && favorites.length > 0 ? (
        // Favorites list
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((favorite: any) => (
            <div key={favorite.id} className="bg-dark-100 p-4 rounded-lg relative group">
              <div 
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromFavorites(favorite.trackId);
                }}
              >
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              
              <div className="aspect-square bg-dark-200 rounded-md overflow-hidden flex items-center justify-center mb-3 relative cursor-pointer"
                onClick={() => handlePlayTrack(favorite)}
              >
                {favorite.albumArt ? (
                  <img 
                    src={favorite.albumArt} 
                    alt={favorite.title} 
                    className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                  />
                ) : (
                  <Music className="text-3xl text-light-300" />
                )}
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 bg-primary hover:bg-primary/90 text-white rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayTrack(favorite);
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <polygon points="5 3 19 12 5 21" />
                    </svg>
                  </Button>
                </div>
              </div>
              
              <h3 className="font-medium text-light-100 truncate">{favorite.title}</h3>
              <p className="text-sm text-light-300 truncate">{favorite.artist}</p>
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-16 w-16 text-light-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
          <p className="text-light-300 max-w-md mb-4">
            You haven't added any tracks to your favorites yet. 
            Explore music and click the heart icon to add favorites.
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
