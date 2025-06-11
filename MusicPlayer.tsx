import React, { useEffect, useState, useRef } from 'react';
import { AudioPlayer } from '@/components/ui/audio-player';
import { useAudio } from '@/hooks/use-audio';
import { Song } from '@shared/schema';
import { 
  addToRecentlyPlayed, 
  likeSong, 
  unlikeSong, 
  fetchLikedSongs 
} from '@/lib/xata';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Drawer } from 'vaul';
import { useToast } from '@/hooks/use-toast';
import { SongCard } from '@/components/SongCard';
import { MusicPlayerContext } from '@/components/Layout';
import { useMobile } from '@/hooks/use-mobile';

interface MusicPlayerProps {
  className?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ className }) => {
  const { currentSong, playSong, playerState } = React.useContext(MusicPlayerContext);
  const { toast } = useToast();
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const isMobile = useMobile();
  
  // Reference to track if we need to update recently played
  const lastPlayedRef = useRef<number | null>(null);
  
  // Load user's liked songs
  useEffect(() => {
    const loadLikedSongs = async () => {
      try {
        const liked = await fetchLikedSongs(1); // User ID 1 for demo
        setLikedSongs(liked.map(song => song.id));
      } catch (error) {
        console.error("Error loading liked songs:", error);
      }
    };
    
    loadLikedSongs();
  }, []);
  
  // Update recently played when song changes
  useEffect(() => {
    if (currentSong && currentSong.id !== lastPlayedRef.current) {
      lastPlayedRef.current = currentSong.id;
      
      // Add to recently played in the backend
      addToRecentlyPlayed(1, currentSong.id).catch(error => {
        console.error("Error adding to recently played:", error);
      });
    }
  }, [currentSong]);
  
  // Add current song to queue if it's not already there
  useEffect(() => {
    if (currentSong && !queue.some(song => song.id === currentSong.id)) {
      setQueue(prev => [...prev, currentSong]);
      setQueueIndex(queue.length);
    }
  }, [currentSong, queue]);
  
  const handleNext = () => {
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);
      playSong(queue[nextIndex]);
    } else {
      toast({
        title: "Queue End",
        description: "You've reached the end of your queue",
      });
    }
  };
  
  const handlePrevious = () => {
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      setQueueIndex(prevIndex);
      playSong(queue[prevIndex]);
    } else {
      toast({
        title: "Queue Start",
        description: "You're at the start of your queue",
      });
    }
  };
  
  const handleLike = () => {
    if (!currentSong) return;
    
    const isCurrentlyLiked = likedSongs.includes(currentSong.id);
    
    if (isCurrentlyLiked) {
      // Unlike song
      unlikeSong(1, currentSong.id).then(() => {
        setLikedSongs(prev => prev.filter(id => id !== currentSong.id));
        toast({
          title: "Removed from Liked Songs",
          description: `"${currentSong.title}" has been removed from your liked songs`
        });
      }).catch(error => {
        console.error("Error unliking song:", error);
        toast({
          title: "Error",
          description: "Could not remove from liked songs. Please try again.",
          variant: "destructive"
        });
      });
    } else {
      // Like song
      likeSong(1, currentSong.id).then(() => {
        setLikedSongs(prev => [...prev, currentSong.id]);
        toast({
          title: "Added to Liked Songs",
          description: `"${currentSong.title}" has been added to your liked songs`
        });
      }).catch(error => {
        console.error("Error liking song:", error);
        toast({
          title: "Error",
          description: "Could not add to liked songs. Please try again.",
          variant: "destructive"
        });
      });
    }
  };
  
  // Render nothing if no song is selected
  if (!currentSong) return null;
  
  // Render the full player for mobile or mini player for desktop
  if (isMobile) {
    return (
      <Drawer.Root open={isFullPlayerOpen} onOpenChange={setIsFullPlayerOpen}>
        {/* Mini player visible when full player is closed */}
        <div className={className}>
          <Drawer.Trigger asChild>
            <div className="cursor-pointer">
              <AudioPlayer
                song={currentSong}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLiked={likedSongs.includes(currentSong.id)}
                onLike={handleLike}
                compact={true}
              />
            </div>
          </Drawer.Trigger>
        </div>
        
        {/* Full screen player on mobile */}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-[90vh] rounded-t-[10px] bg-background flex flex-col">
            <div className="p-4 overflow-y-auto flex-1 flex flex-col">
              {/* Drag handle */}
              <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-6"></div>
              
              {/* Song artwork */}
              <div className="relative w-full pb-4 flex justify-center">
                <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={currentSong.coverImage || 'https://placehold.co/512/gray/white?text=No+Image'} 
                    alt={`${currentSong.title} by ${currentSong.artist}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Song info */}
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold">{currentSong.title}</h2>
                <p className="text-muted-foreground">{currentSong.artist}</p>
              </div>
              
              {/* Audio player controls */}
              <div className="mt-10">
                <AudioPlayer
                  song={currentSong}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isLiked={likedSongs.includes(currentSong.id)}
                  onLike={handleLike}
                  showArtwork={false}
                  className="border-none"
                />
              </div>
              
              {/* Queue */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Up Next</h3>
                <div className="space-y-1">
                  {queue.slice(queueIndex + 1, queueIndex + 4).map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      onPlay={() => {
                        const newIndex = queue.findIndex(s => s.id === song.id);
                        if (newIndex !== -1) {
                          setQueueIndex(newIndex);
                          playSong(song);
                        }
                      }}
                      variant="horizontal"
                    />
                  ))}
                  
                  {queue.length <= queueIndex + 1 && (
                    <div className="py-4 text-center text-muted-foreground text-sm">
                      No more songs in queue
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  
  // Desktop version with sheet
  return (
    <>
      <div className={className}>
        <Sheet>
          <SheetTrigger asChild>
            <div className="cursor-pointer">
              <AudioPlayer
                song={currentSong}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLiked={likedSongs.includes(currentSong.id)}
                onLike={handleLike}
              />
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] p-0 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Song artwork */}
              <div className="relative w-full pb-[100%]">
                <img 
                  src={currentSong.coverImage || 'https://placehold.co/512/gray/white?text=No+Image'} 
                  alt={`${currentSong.title} by ${currentSong.artist}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Song info and player */}
              <div className="p-4 flex-1 overflow-hidden flex flex-col">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">{currentSong.title}</h2>
                  <p className="text-muted-foreground">{currentSong.artist}</p>
                </div>
                
                <AudioPlayer
                  song={currentSong}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isLiked={likedSongs.includes(currentSong.id)}
                  onLike={handleLike}
                  showArtwork={false}
                  className="border-none"
                />
                
                {/* Queue */}
                <div className="mt-6 flex-1 overflow-hidden">
                  <h3 className="text-sm font-medium mb-2">Queue</h3>
                  <div className="overflow-y-auto max-h-[calc(100%-2rem)] space-y-1 pr-2">
                    {queue.map((song, index) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        onPlay={() => {
                          setQueueIndex(index);
                          playSong(song);
                        }}
                        isPlaying={currentSong.id === song.id}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
