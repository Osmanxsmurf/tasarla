import React from 'react';
import { Play, Heart } from 'lucide-react';
import { DEFAULT_COVER_URL } from '@/lib/constants';
import { formatDuration, getTimeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MusicPlayerContext } from './Layout';
import { addToLibrary } from '@/lib/xata';
import { useToast } from '@/hooks/use-toast';
import type { Song } from '@shared/schema';

interface SongTableProps {
  songs: Song[];
  title?: string;
  showViewAll?: boolean;
  onViewAllClick?: () => void;
  className?: string;
}

export const SongTable: React.FC<SongTableProps> = ({
  songs,
  title,
  showViewAll = false,
  onViewAllClick,
  className,
}) => {
  const { playSong, currentSong, isPlaying } = React.useContext(MusicPlayerContext);
  const { toast } = useToast();
  
  const handlePlay = (song: Song) => {
    playSong(song);
  };
  
  const handleAddToLibrary = async (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    
    try {
      await addToLibrary(song.id);
      toast({
        title: 'Kütüphanenize eklendi',
        description: `${song.title} kütüphanenize eklendi.`,
      });
    } catch (error) {
      console.error('Failed to add to library:', error);
      toast({
        title: 'Hata',
        description: 'Kütüphaneye eklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };
  
  if (songs.length === 0) {
    return (
      <div className={className}>
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
        )}
        <div className="bg-surface rounded-xl p-10 text-center">
          <p className="text-muted-foreground">Şarkı bulunamadı</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={className}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          {showViewAll && (
            <button 
              className="text-primary hover:underline text-sm"
              onClick={onViewAllClick}
            >
              Tümünü Gör
            </button>
          )}
        </div>
      )}
      
      <div className="bg-surface rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-secondary">
            <tr className="text-muted-foreground text-left">
              <th className="p-4 w-10">#</th>
              <th className="p-4">Başlık</th>
              <th className="p-4 hidden md:table-cell">Albüm</th>
              <th className="p-4 hidden lg:table-cell">Eklenme Tarihi</th>
              <th className="p-4 w-20 text-right">Süre</th>
              <th className="p-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => {
              const isActive = currentSong?.id === song.id;
              
              return (
                <tr 
                  key={song.id} 
                  className={`hover:bg-secondary cursor-pointer group ${isActive ? 'bg-secondary bg-opacity-50' : ''}`}
                  onClick={() => handlePlay(song)}
                >
                  <td className="p-4 align-middle">
                    <span className="group-hover:hidden inline-block">
                      {index + 1}
                    </span>
                    <span className="hidden group-hover:inline-block">
                      {isActive && isPlaying ? (
                        <div className="wave-animation flex h-5">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={song.coverUrl || DEFAULT_COVER_URL} 
                        alt={song.title} 
                        className="w-10 h-10 rounded object-cover" 
                      />
                      <div>
                        <h4 className="font-medium">{song.title}</h4>
                        <p className="text-sm text-muted-foreground">{song.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">
                    {song.album || '-'}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground">
                    {song.createdAt ? getTimeAgo(song.createdAt) : '-'}
                  </td>
                  <td className="p-4 text-right text-muted-foreground">
                    {formatDuration(song.duration)}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleAddToLibrary(e, song)}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
