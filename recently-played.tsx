import React from 'react';
import { Play, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/music-context';

export function RecentlyPlayed() {
  const { recentlyPlayed, playSong } = useMusic();

  if (recentlyPlayed.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">Recently Played</h2>
            <p className="text-gray-400">Jump back into your favorite tunes</p>
          </div>
        </div>
        
        <Card className="glassmorphism rounded-2xl p-8 text-center border-white/10">
          <div className="text-gray-400 mb-2">No recently played songs</div>
          <div className="text-sm text-gray-500">Start listening to see your recent activity here</div>
        </Card>
      </section>
    );
  }

  const handlePlaySong = (song: any) => {
    playSong(song, recentlyPlayed);
  };

  const getTimeAgo = (index: number) => {
    const hours = index * 2 + 1;
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">Recently Played</h2>
          <p className="text-gray-400">Jump back into your favorite tunes</p>
        </div>
        <Button 
          variant="ghost"
          className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
        >
          <span>Clear History</span>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recentlyPlayed.slice(0, 6).map((song, index) => (
          <Card 
            key={`${song.id}-${index}`}
            className="glassmorphism rounded-2xl p-4 flex items-center space-x-4 hover:bg-white/5 transition-colors cursor-pointer group border-white/10"
          >
            <div className="relative">
              <img 
                src={song.thumbnail}
                alt={`${song.title} artwork`}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  onClick={() => handlePlaySong(song)}
                  className="bg-primary hover:bg-primary/90 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <Play className="text-white h-3 w-3 ml-0.5" fill="currentColor" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold mb-1 text-sm text-white" title={song.title}>
                {song.title}
              </h3>
              <p className="text-gray-400 text-xs" title={song.artist}>
                {song.artist}
              </p>
              <div className="text-xs text-gray-500 mt-1">
                {getTimeAgo(index)}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
