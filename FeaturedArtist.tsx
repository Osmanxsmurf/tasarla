import React from 'react';
import { Play } from 'lucide-react';
import { LastFmArtist } from '@/types/lastfm';
import { useMusic } from '@/contexts/MusicContext';
import { useLastFmSearch } from '@/hooks/useLastFm';

interface FeaturedArtistProps {
  artist: LastFmArtist;
}

const FeaturedArtist = ({ artist }: FeaturedArtistProps) => {
  const { playTrack } = useMusic();
  
  // Fetch top tracks from this artist to play when the "Listen Now" button is clicked
  const { data: topTracksData } = useLastFmSearch(artist.name, 'track', !!artist.name);
  
  const handlePlay = () => {
    // If we have top tracks for this artist, play the first one
    if (topTracksData?.results?.trackmatches?.track?.[0]) {
      playTrack(topTracksData.results.trackmatches.track[0]);
    }
  };
  
  return (
    <div className="md:col-span-2 bg-gradient-to-r from-primary/40 to-card rounded-xl overflow-hidden shadow-lg">
      <div className="p-5 flex flex-col md:flex-row gap-4 md:items-center">
        {/* Artist image */}
        <div className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden">
          {artist.image?.[3]['#text'] ? (
            <img 
              src={artist.image[3]['#text']} 
              alt={artist.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-foreground/60">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <span className="inline-block px-2 py-1 bg-primary/50 text-primary-foreground text-xs rounded-full mb-2">Öne Çıkan Sanatçı</span>
          <h2 className="text-2xl font-bold mb-1">{artist.name}</h2>
          <p className="text-muted-foreground mb-3 line-clamp-2">
            {artist.bio?.summary 
              ? artist.bio.summary.replace(/<[^>]*>/g, '') // Remove HTML tags
              : `${artist.name} için daha fazla bilgi keşfedin.`
            }
          </p>
          <div className="flex flex-wrap gap-2">
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
              onClick={handlePlay}
            >
              <Play className="w-4 h-4 mr-1" />
              Şimdi Dinle
            </button>
            <button className="px-4 py-2 bg-secondary text-foreground rounded-full text-sm font-medium hover:bg-muted transition-colors">
              Takip Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtist;
