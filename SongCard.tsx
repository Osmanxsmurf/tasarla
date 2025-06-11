import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, Heart, MoreHorizontal, Headphones } from 'lucide-react';
import { Song } from '@shared/schema';
import { motion } from 'framer-motion';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onLike?: (song: Song) => void;
  isLiked?: boolean;
  isPlaying?: boolean;
  variant?: 'default' | 'horizontal' | 'minimal';
  className?: string;
  showPlayCount?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  onPlay,
  onLike,
  isLiked = false,
  isPlaying = false,
  variant = 'default',
  className,
  showPlayCount = false
}) => {
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(song);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(song);
  };
  
  // Horizontal card layout
  if (variant === 'horizontal') {
    return (
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className={cn(
          'bg-card hover:bg-muted/50 transition-all rounded-lg overflow-hidden shadow-sm flex items-center p-2 cursor-pointer',
          className
        )}
        onClick={handlePlay}
      >
        <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
          <img 
            src={song.coverImage || 'https://placehold.co/200/gray/white?text=No+Image'} 
            alt={`${song.title} by ${song.artist}`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{song.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          {showPlayCount && (
            <div className="flex items-center text-xs text-muted-foreground mr-2">
              <Headphones className="w-3 h-3 mr-1" />
              <span>{song.playCount || 0}</span>
            </div>
          )}
          
          {onLike && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 text-muted-foreground hover:text-foreground",
                isLiked && "text-red-500 hover:text-red-600"
              )}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
            </Button>
          )}
          
          <Button 
            variant={isPlaying ? "default" : "secondary"} 
            size="icon" 
            className="h-8 w-8"
            onClick={handlePlay}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }
  
  // Minimal card layout
  if (variant === 'minimal') {
    return (
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer',
          className
        )}
        onClick={handlePlay}
      >
        <span className="text-muted-foreground w-5 text-center text-sm">{song.id}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{song.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
        
        {isPlaying && (
          <div className="w-3 flex space-x-0.5">
            <div className="w-0.5 h-3 bg-primary animate-[wave_1.5s_ease-in-out_infinite]"></div>
            <div className="w-0.5 h-3 bg-primary animate-[wave_1.7s_ease-in-out_infinite_0.1s]"></div>
            <div className="w-0.5 h-3 bg-primary animate-[wave_1.3s_ease-in-out_infinite_0.2s]"></div>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Play className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }
  
  // Default card layout (grid style)
  return (
    <motion.div
      whileHover={{ translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'bg-card hover:bg-muted/50 transition-all rounded-lg overflow-hidden shadow-sm flex flex-col cursor-pointer h-full',
        className
      )}
      onClick={handlePlay}
    >
      {/* Card image with overlay play button */}
      <div className="relative">
        <img 
          src={song.coverImage || 'https://placehold.co/300/gray/white?text=No+Image'} 
          alt={`${song.title} by ${song.artist}`} 
          className="w-full aspect-square object-cover"
        />
        <Button 
          className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-2 rounded-full opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-lg"
          size="icon"
          onClick={handlePlay}
        >
          <Play />
        </Button>
        
        {isPlaying && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-background/95 p-1.5 rounded-full">
              <Play className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}
      </div>
      
      {/* Card content */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-medium text-sm truncate">{song.title}</h3>
        <p className="text-muted-foreground text-xs truncate">{song.artist}</p>
        
        <div className="flex items-center justify-between mt-2">
          <Badge variant="secondary" className="text-xs">
            {song.genre || 'Unknown'}
          </Badge>
          
          {onLike && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-7 w-7 text-muted-foreground hover:text-foreground",
                isLiked && "text-red-500 hover:text-red-600"
              )}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
