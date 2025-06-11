import { PlayIcon, Disc } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/contexts/PlayerContext";

type Album = {
  id?: number;
  title: string;
  artist: string;
  year?: string;
  coverImage?: string;
  // This would contain tracks in a real implementation
  tracks?: any[];
};

type AlbumCardProps = {
  album: Album;
  className?: string;
};

export default function AlbumCard({ album, className }: AlbumCardProps) {
  const { playTrack } = usePlayer();
  
  const handlePlay = () => {
    // In a real implementation, we would start playing the first track of the album
    // For now, we'll just create a mock track from the album data
    if (album) {
      playTrack({
        id: album.id || 0,
        title: album.title,
        artist: album.artist,
        album: album.title,
        coverImage: album.coverImage
      });
    }
  };
  
  return (
    <div 
      className={cn(
        "bg-card rounded-lg p-3 hover:bg-muted transition cursor-pointer group",
        className
      )}
      onClick={handlePlay}
    >
      <div className="relative mb-3 aspect-square rounded-md overflow-hidden">
        {album.coverImage ? (
          <img 
            src={album.coverImage} 
            alt={`${album.title} - ${album.artist}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Disc className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <button className="bg-primary text-primary-foreground p-2 rounded-full">
            <PlayIcon className="h-5 w-5 ml-0.5" />
          </button>
        </div>
      </div>
      <h3 className="text-sm font-medium truncate">{album.title}</h3>
      <p className="text-xs text-muted-foreground truncate">{album.artist}</p>
      {album.year && (
        <p className="text-xs text-muted-foreground mt-1">Albüm • {album.year}</p>
      )}
    </div>
  );
}
