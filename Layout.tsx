import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Sidebar from './Sidebar';
import { EnhancedMusicPlayer } from '@/components/ui/enhanced-music-player';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { createWebSocketConnection } from '@/lib/utils';
import type { Song } from '@shared/schema';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  
  // WebSocket connection
  useEffect(() => {
    const ws = createWebSocketConnection();
    
    ws.onopen = () => {
      setWsConnected(true);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different message types
        switch (data.type) {
          case 'connected':
            console.log('WebSocket connected:', data.message);
            break;
          case 'library_updated':
          case 'recently_played_updated':
            // In a real app, we'd refresh the relevant data
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      setWsConnected(false);
    };
    
    return () => {
      ws.close();
    };
  }, []);
  
  // Function to play a song
  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          currentPath={location}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-5">
          {/* Mobile header */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </span>
              Müzik Asistanım
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSidebar}
                className="p-2 rounded-full bg-secondary"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
          
          {/* Page content */}
          {children}
        </main>
      </div>
      
      {/* Music player */}
      <EnhancedMusicPlayer 
        currentSong={currentSong} 
        isPlaying={isPlaying}
        onPlayStateChange={setIsPlaying}
      />
    </div>
  );
};

// Create a context to provide the play function to all components
export const MusicPlayerContext = React.createContext<{
  playSong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}>({
  playSong: () => {},
  currentSong: null,
  isPlaying: false,
});

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };
  
  return (
    <MusicPlayerContext.Provider value={{ playSong, currentSong, isPlaying }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export default Layout;
