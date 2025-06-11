import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth-context";

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail?: string;
  url?: string;
  source: string; // "youtube" or "lastfm"
}

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  history: Track[];
  isAuthenticated: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<Track[]>([]);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const playTrack = (track: Track) => {
    // Add current track to history if it exists
    if (currentTrack) {
      setHistory(prev => [currentTrack, ...prev.slice(0, 19)]);
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
    
    toast({
      title: "Now playing",
      description: `${track.title} by ${track.artist}`,
    });
  };
  
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  const resumeTrack = () => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  };
  
  const addToQueue = (track: Track) => {
    // Check if track is already in queue
    if (queue.some(t => t.id === track.id)) {
      toast({
        title: "Already in queue",
        description: `${track.title} is already in your play queue`,
      });
      return;
    }
    
    setQueue(prev => [...prev, track]);
    
    toast({
      title: "Added to queue",
      description: `${track.title} has been added to your play queue`,
    });
  };
  
  const removeFromQueue = (trackId: string) => {
    setQueue(prev => prev.filter(track => track.id !== trackId));
  };
  
  const clearQueue = () => {
    setQueue([]);
    
    toast({
      title: "Queue cleared",
      description: "Your play queue has been cleared",
    });
  };
  
  const playNextTrack = () => {
    if (queue.length > 0) {
      // Get the next track
      const nextTrack = queue[0];
      
      // Remove it from the queue
      setQueue(prev => prev.slice(1));
      
      // Play it
      playTrack(nextTrack);
    } else {
      // No more tracks in queue
      setIsPlaying(false);
    }
  };
  
  const playPreviousTrack = () => {
    if (history.length > 0) {
      // Get the previous track
      const previousTrack = history[0];
      
      // Remove it from history
      setHistory(prev => prev.slice(1));
      
      // Add current track to the front of the queue
      if (currentTrack) {
        setQueue(prev => [currentTrack, ...prev]);
      }
      
      // Play the previous track
      setCurrentTrack(previousTrack);
      setIsPlaying(true);
    }
  };
  
  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        playTrack,
        pauseTrack,
        resumeTrack,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playNextTrack,
        playPreviousTrack,
        history,
        isAuthenticated
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
}
