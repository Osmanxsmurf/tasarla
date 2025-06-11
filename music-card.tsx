import React from 'react';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Song } from '@/types/music';

interface MusicCardProps {
  song: Song;
  onPlay?: (song: Song) => void;
  onLike?: (song: Song) => void;
  showMatch?: boolean;
  className?: string;
}

export function MusicCard({ 
  song, 
  onPlay, 
  onLike, 
  showMatch = false,
  className = "" 
}: MusicCardProps) {
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay?.(song);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(song);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`glassmorphism rounded-2xl p-4 cursor-pointer group hover:bg-white/5 transition-all duration-300 hover:transform hover:scale-105 ${className}`}>
      <div className="relative mb-4">
        <img 
          src={song.thumbnail} 
          alt={`${song.title} artwork`}
          className="w-full aspect-square object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
          <Button
            onClick={handlePlay}
            className="bg-primary hover:bg-primary/90 w-12 h-12 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform"
          >
            <Play className="text-white h-5 w-5 ml-0.5" fill="currentColor" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-sm truncate text-white" title={song.title}>
          {song.title}
        </h3>
        <p className="text-gray-400 text-xs truncate" title={song.artist}>
          {song.artist}
        </p>
        
        {song.duration > 0 && (
          <p className="text-gray-500 text-xs">
            {formatDuration(song.duration)}
          </p>
        )}
        
        {showMatch && song.aiMatch && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-xs text-primary font-medium">
              {song.aiMatch}% Match
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <Heart className="h-4 w-4 text-gray-400 hover:text-red-400" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
