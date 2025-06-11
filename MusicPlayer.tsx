import React, { useState, useEffect } from 'react';
import { Song } from '@shared/schema';
import { DEFAULT_COVER_URL } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';
import { AudioPlayer } from '@/components/ui/audio-player';
import { Heart, Clock, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToLibrary, addToRecentlyPlayed } from '@/lib/xata';
import { useToast } from '@/hooks/use-toast';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentSong, 
  isPlaying, 
  onPlayStateChange 
}) => {
  const [liked, setLiked] = useState(false);
  const [animationDuration, setAnimationDuration] = useState('30s');
  const { toast } = useToast();
  
  useEffect(() => {
    if (currentSong) {
      // Record the song as recently played
      addToRecentlyPlayed(currentSong.id)
        .catch(error => console.error('Failed to record recently played:', error));
      
      // Set animation duration based on song duration
      if (currentSong.duration) {
        setAnimationDuration(`${currentSong.duration}s`);
      } else {
        setAnimationDuration('30s');
      }
      
      // Reset liked state for new song
      setLiked(false);
    }
  }, [currentSong]);
  
  const handleLike = async () => {
    if (!currentSong) return;
    
    try {
      await addToLibrary(currentSong.id);
      setLiked(true);
      toast({
        title: 'Kütüphanenize eklendi',
        description: `${currentSong.title} kütüphanenize eklendi.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to add to library:', error);
      toast({
        title: 'Hata',
        description: 'Kütüphaneye eklenirken bir hata oluştu.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };
  
  // If no song is selected, show a minimal player with a welcome message
  if (!currentSong) {
    return (
      <div className="bg-surface border-t border-secondary p-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 text-center">
            <div className="animate-pulse">
              <h3 className="text-primary font-medium mb-1">Hoş Geldiniz!</h3>
              <p className="text-muted-foreground text-sm">
                Dinlemek istediğiniz şarkıyı seçmek için bir sanatçı arayın veya önerilen şarkılara göz atın.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-surface border-t border-secondary p-4 ${isPlaying ? 'playing' : ''}`}>
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Currently playing song info */}
        <div className="col-span-12 md:col-span-3">
          <div className="flex items-center gap-3">
            <img 
              src={currentSong.coverUrl || DEFAULT_COVER_URL} 
              alt={currentSong.title} 
              className="w-14 h-14 rounded-md hidden sm:block object-cover" 
            />
            <div>
              <h4 className="font-medium text-sm sm:text-base truncate">{currentSong.title}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
          </div>
        </div>
        
        {/* Player controls */}
        <div className="col-span-12 md:col-span-6">
          <AudioPlayer 
            src={currentSong.audioUrl || ''}
            autoPlay={isPlaying}
            onPlay={() => onPlayStateChange(true)}
            onPause={() => onPlayStateChange(false)}
            onEnd={() => onPlayStateChange(false)}
          />
        </div>
        
        {/* Volume & additional controls */}
        <div className="col-span-12 md:col-span-3">
          <div className="flex items-center justify-end gap-3">
            {isPlaying && (
              <div className="wave-animation hidden md:flex mr-2">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              disabled={liked}
              className={liked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hidden md:flex"
            >
              <Clock className="h-5 w-5" />
              <span className="sr-only">Duration</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hidden md:flex"
            >
              <Folder className="h-5 w-5" />
              <span className="sr-only">Add to playlist</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
