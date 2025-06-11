import { PlayIcon, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";

type Playlist = {
  id: number;
  name: string;
  description?: string;
  coverImage?: string;
  trackCount: number;
  duration: number;
};

type PlaylistCardProps = {
  playlist: Playlist;
  className?: string;
  onPlay?: (playlist: Playlist) => void;
};

export default function PlaylistCard({ playlist, className, onPlay }: PlaylistCardProps) {
  const handlePlay = () => {
    if (onPlay) {
      onPlay(playlist);
    }
  };
  
  const formatPlaylistDuration = (seconds: number): string => {
    if (!seconds) return "0 dk";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} saat ${minutes} dakika`;
    }
    
    return `${minutes} dakika`;
  };
  
  return (
    <div 
      className={cn(
        "bg-card rounded-lg p-4 hover:bg-muted transition cursor-pointer group",
        className
      )}
      onClick={handlePlay}
    >
      <div className="relative mb-4 aspect-square rounded-md overflow-hidden">
        {playlist.coverImage ? (
          <img 
            src={playlist.coverImage} 
            alt={playlist.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Music className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <button className="bg-primary text-primary-foreground p-3 rounded-full">
            <PlayIcon className="h-6 w-6 ml-0.5" />
          </button>
        </div>
      </div>
      <h3 className="text-base font-medium">{playlist.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {playlist.trackCount} şarkı • {formatPlaylistDuration(playlist.duration)}
      </p>
    </div>
  );
}
