import { PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/contexts/PlayerContext";

type Track = {
  id: number;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  coverImage?: string;
  lastfmId?: string;
};

type TrackCardProps = {
  track: Track;
  className?: string;
};

export default function TrackCard({ track, className }: TrackCardProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  
  const isActive = currentTrack?.id === track.id;
  
  const handlePlay = () => {
    playTrack(track);
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
        <img 
          src={track.coverImage || "https://placehold.co/300x300/333/FFF?text=MüzikAI"} 
          alt={`${track.title} - ${track.artist}`} 
          className="w-full h-full object-cover"
        />
        <div className={cn(
          "absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity",
          isActive && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <button className="bg-primary text-primary-foreground p-2 rounded-full">
            {isActive && isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <PlayIcon className="h-5 w-5 ml-0.5" />
            )}
          </button>
        </div>
      </div>
      <h3 className="text-sm font-medium truncate">{track.title}</h3>
      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
    </div>
  );
}
