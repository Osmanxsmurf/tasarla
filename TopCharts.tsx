import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Headphones, ChevronRight } from 'lucide-react';
import { Song } from '@shared/schema';
import { motion } from 'framer-motion';

interface TopChartsProps {
  title: string;
  genre?: string;
  songs: Song[];
  onPlay: (song: Song) => void;
  loading?: boolean;
  className?: string;
}

export const TopCharts: React.FC<TopChartsProps> = ({
  title,
  genre,
  songs,
  onPlay,
  loading = false,
  className
}) => {
  return (
    <Card className={cn(
      "bg-card hover:bg-muted/50 border transition-all overflow-hidden shadow-sm",
      className
    )}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{title}</h3>
            {genre && (
              <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full">{genre}</span>
            )}
          </div>
          
          <ul className="space-y-3">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="font-bold text-lg text-muted-foreground w-6">{i+1}</span>
                  <div className="flex-1 h-8 bg-muted rounded animate-pulse"></div>
                </li>
              ))
            ) : songs.length > 0 ? (
              songs.slice(0, 3).map((song, index) => (
                <motion.li 
                  key={song.id} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <span className="font-bold text-lg text-muted-foreground w-6">{index+1}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{song.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-primary transition p-1"
                    onClick={() => onPlay(song)}
                  >
                    <Headphones className="h-4 w-4" />
                  </Button>
                </motion.li>
              ))
            ) : (
              <li className="text-center py-4 text-muted-foreground text-sm">
                Henüz şarkı bulunamadı
              </li>
            )}
          </ul>
        </div>
        
        <div className="px-4 py-3 border-t border-muted">
          <Button variant="link" className="w-full text-sm text-primary flex items-center justify-center gap-1">
            <span>Tümünü Gör</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCharts;
