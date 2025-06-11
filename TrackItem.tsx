import React from 'react';
import { Play, Plus } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { LastFmTrack } from '@/types/lastfm';
import { formatDuration } from '@/lib/utils';

interface TrackItemProps {
  track: LastFmTrack;
  index?: number;
  showPlayCount?: boolean;
  showDuration?: boolean;
  showAddButton?: boolean;
}

const TrackItem = ({ 
  track, 
  index, 
  showPlayCount = false, 
  showDuration = true,
  showAddButton = false
}: TrackItemProps) => {
  const { playTrack, addToQueue, currentTrack } = useMusic();
  
  const isCurrentTrack = currentTrack && 
    currentTrack.name === track.name && 
    currentTrack.artist.name === track.artist.name;
  
  const handlePlay = () => {
    playTrack(track);
  };
  
  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
  };
  
  // Calculate duration in minutes:seconds format
  const duration = track.duration ? formatDuration(parseInt(track.duration) / 1000) : '--:--';
  
  return (
    <div 
      className="flex items-center gap-3 py-1 hover:bg-secondary rounded-lg px-2 transition-colors group cursor-pointer"
      onClick={handlePlay}
    >
      {index !== undefined && (
        <div className="text-muted-foreground w-5 text-center">{index + 1}</div>
      )}
      
      <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0 relative">
        {track.album?.image?.[0]['#text'] ? (
          <img 
            src={track.album.image[0]['#text']} 
            alt={`${track.name} by ${track.artist.name}`} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-foreground/60">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="min-w-0 flex-1">
        <h4 className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-primary' : ''}`}>
          {track.name}
        </h4>
        <p className="text-xs text-muted-foreground truncate">{track.artist.name}</p>
      </div>
      
      {showPlayCount && track.playcount && (
        <div className="text-xs text-muted-foreground hidden md:block">
          {parseInt(track.playcount).toLocaleString()} plays
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        {showDuration && (
          <div className="text-xs text-muted-foreground">{duration}</div>
        )}
        
        {showAddButton && (
          <button 
            className="p-1 rounded-full hover:bg-border opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleAddToQueue}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackItem;
