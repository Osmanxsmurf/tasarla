import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeaturedPlaylistProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  listeners?: number;
  onPlay: () => void;
  className?: string;
}

export const FeaturedPlaylist: React.FC<FeaturedPlaylistProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  listeners,
  onPlay,
  className
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-xl overflow-hidden group",
        className
      )}
    >
      <img 
        src={imageUrl} 
        alt={title} 
        className="object-cover w-full h-48 md:h-56 transform transition-transform duration-700 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <span className="text-sm text-white/80">{subtitle}</span>
          <h3 className="text-white text-2xl font-bold">{title}</h3>
          <p className="text-white/80 text-sm mb-4">{description}</p>
          
          <div className="flex items-center gap-2">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 transition shadow-lg"
              onClick={onPlay}
            >
              <Play className="h-4 w-4" />
              Çal
            </Button>
            
            {listeners !== undefined && (
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white flex items-center gap-2 transition backdrop-blur-sm"
              >
                <Users className="h-4 w-4" />
                {listeners.toLocaleString()} dinleyici
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedPlaylist;
