import React from 'react';
import { Play, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/music-context';

export function HeroSection() {
  const { aiRecommendations, playSong } = useMusic();
  
  const featuredSong = aiRecommendations[0];

  const handlePlayFeatured = () => {
    if (featuredSong) {
      playSong(featuredSong, aiRecommendations);
    }
  };

  return (
    <section className="mb-12">
      <div 
        className="relative h-80 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20"
        style={{
          backgroundImage: `linear-gradient(rgba(29, 185, 84, 0.7), rgba(78, 205, 196, 0.7)), url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark-200/80 to-transparent"></div>
        <div className="relative h-full flex items-end p-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <span className="text-sm font-medium text-yellow-400">
                Featured Playlist
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white">
              AI Curated Hits
            </h1>
            <p className="text-lg text-gray-200 mb-6 max-w-md">
              Discover the perfect blend of trending tracks and hidden gems, 
              personally curated by our AI based on your listening habits.
            </p>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handlePlayFeatured}
                className="bg-primary hover:bg-primary/90 px-8 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all transform hover:scale-105"
              >
                <Play className="h-5 w-5" fill="currentColor" />
                <span>Play Now</span>
              </Button>
              <Button 
                variant="outline"
                className="border-white/30 hover:border-white/60 px-6 py-3 rounded-full font-semibold transition-colors text-white hover:text-white"
              >
                <Heart className="h-4 w-4 mr-2" />
                Save to Library
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
