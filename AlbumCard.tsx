import React from 'react';
import { Play } from 'lucide-react';
import { LastFmAlbum } from '@/types/lastfm';
import { useMusic } from '@/contexts/MusicContext';

interface AlbumCardProps {
  album: LastFmAlbum;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const { playTrack } = useMusic();
  
  const handlePlay = () => {
    // If the album has tracks, play the first one
    if (album.tracks?.track && album.tracks.track.length > 0) {
      playTrack(album.tracks.track[0]);
    } else {
      // If no tracks are available, we can't play. In a real app,
      // we would fetch the album's tracks first.
      console.log('No tracks available for this album');
    }
  };
  
  return (
    <div className="bg-card rounded-lg p-3 hover:bg-secondary transition-colors cursor-pointer group" onClick={handlePlay}>
      <div className="mb-3 rounded-md overflow-hidden relative aspect-square">
        {album.image?.[3]['#text'] ? (
          <img 
            src={album.image[3]['#text']} 
            alt={`${album.name} by ${album.artist}`} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-foreground/60">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        )}
        
        <button className="absolute bottom-2 right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
          <Play className="w-5 h-5 text-white" />
        </button>
      </div>
      <h3 className="font-medium text-sm mb-1 truncate">{album.name}</h3>
      <p className="text-muted-foreground text-xs truncate">{album.artist}</p>
    </div>
  );
};

export default AlbumCard;
