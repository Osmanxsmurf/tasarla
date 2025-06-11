import React from 'react';
import { Play, Heart, MoreHorizontal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/music-context';
import { Skeleton } from '@/components/ui/skeleton';

export function TrendingSection() {
  const { trendingSongs, playSong } = useMusic();

  if (trendingSongs.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">Trending Now</h2>
            <p className="text-gray-400">What everyone's listening to right now</p>
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const handlePlaySong = (song: any, index: number) => {
    playSong(song, trendingSongs);
  };

  const formatStreams = (popularity: number) => {
    if (popularity > 1000000) {
      return `${(popularity / 1000000).toFixed(1)}M`;
    } else if (popularity > 1000) {
      return `${(popularity / 1000).toFixed(1)}K`;
    }
    return popularity.toString();
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">Trending Now</h2>
          <p className="text-gray-400">What everyone's listening to right now</p>
        </div>
        <Button 
          variant="ghost"
          className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
        >
          <span>See All Trends</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {trendingSongs.slice(0, 5).map((song, index) => (
          <Card 
            key={song.id}
            className="glassmorphism rounded-2xl p-4 flex items-center space-x-4 hover:bg-white/5 transition-colors cursor-pointer group border-white/10"
          >
            <div className="flex items-center justify-center w-8 h-8 text-primary font-bold">
              <span>{index + 1}</span>
            </div>
            
            <div className="relative">
              <img 
                src={song.thumbnail}
                alt={`${song.title} artwork`}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  onClick={() => handlePlaySong(song, index)}
                  className="bg-primary hover:bg-primary/90 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <Play className="text-white h-3 w-3 ml-0.5" fill="currentColor" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold mb-1 text-white" title={song.title}>
                {song.title}
              </h3>
              <p className="text-gray-400 text-sm" title={song.artist}>
                {song.artist}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-primary">
                {formatStreams(song.popularity || 0)}
              </div>
              <div className="text-xs text-gray-400">streams</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Heart className="h-4 w-4 text-gray-400 hover:text-red-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
