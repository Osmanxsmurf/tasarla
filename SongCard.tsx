import React from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_COVER_URL } from '@/lib/constants';
import type { Song } from '@shared/schema';
import { MusicPlayerContext } from './Layout';

interface SongCardProps {
  song: Song;
  onClick?: () => void;
  className?: string;
  isCompact?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  onClick, 
  className,
  isCompact = false
}) => {
  const { currentSong, isPlaying } = React.useContext(MusicPlayerContext);
  const isCurrentSong = currentSong?.id === song.id;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div 
      className={cn(
        "bg-surface p-4 rounded-lg transition-all hover:bg-opacity-80 cursor-pointer group",
        className
      )}
      onClick={handleClick}
    >
      <div className="relative mb-3 aspect-square bg-secondary rounded-md overflow-hidden">
        <img 
          src={song.coverUrl || DEFAULT_COVER_URL} 
          alt={`${song.title} - ${song.artist}`} 
          className="w-full h-full object-cover" 
        />
        <button className={cn(
          "absolute right-2 bottom-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center",
          isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
        )}>
          {isCurrentSong && isPlaying ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <Play className="h-5 w-5 text-white ml-0.5" />
          )}
        </button>
      </div>
      
      {!isCompact && (
        <>
          <h3 className="font-medium mb-1 truncate">{song.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </>
      )}
      
      {isCompact && (
        <div className="flex justify-between items-center">
          <div className="truncate">
            <p className="font-medium truncate">{song.title}</p>
            <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
          </div>
        </div>
      )}
    </div>
  );
};
