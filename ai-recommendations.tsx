import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MusicCard } from './music-card';
import { useMusic } from '@/contexts/music-context';
import { Skeleton } from '@/components/ui/skeleton';

export function AIRecommendations() {
  const { aiRecommendations, playSong, loadAIRecommendations } = useMusic();
  
  if (aiRecommendations.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">AI Powered For You</h2>
            <p className="text-gray-400">Personalized recommendations based on your taste and mood</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const handlePlaySong = (song: any) => {
    playSong(song, aiRecommendations);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">AI Powered For You</h2>
          <p className="text-gray-400">Personalized recommendations based on your taste and mood</p>
        </div>
        <Button 
          onClick={loadAIRecommendations}
          variant="ghost"
          className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
        >
          <span>Refresh</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {aiRecommendations.slice(0, 6).map((song) => (
          <MusicCard
            key={song.id}
            song={song}
            onPlay={handlePlaySong}
            showMatch={true}
          />
        ))}
      </div>
    </section>
  );
}
