import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type Artist = {
  id?: number;
  name: string;
  image?: string;
};

type ArtistCardProps = {
  artist: Artist;
  className?: string;
  onView?: (artist: Artist) => void;
};

export default function ArtistCard({ artist, className, onView }: ArtistCardProps) {
  const handleClick = () => {
    if (onView) {
      onView(artist);
    }
  };
  
  return (
    <div 
      className={cn(
        "text-center cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="relative mb-3 w-full aspect-square rounded-full overflow-hidden mx-auto">
        {artist.image ? (
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <User className="h-1/3 w-1/3 text-muted-foreground" />
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium">{artist.name}</h3>
    </div>
  );
}
