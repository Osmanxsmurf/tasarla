import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Track } from "@shared/schema";
import { usePlayer } from "@/hooks/use-player";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface TrackCardProps {
  track: Track;
  className?: string;
}

export function TrackCard({ track, className = "" }: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { play, currentTrack, isPlaying } = usePlayer();
  const queryClient = useQueryClient();

  const isCurrentTrack = currentTrack?.id === track.id;

  const likeMutation = useMutation({
    mutationFn: () => api.tracks.update(track.id, { isLiked: !track.isLiked }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracks"] });
    },
  });

  const handlePlay = () => {
    play(track);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate();
  };

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div
      className={`bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition-all duration-300 cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      <div className="relative mb-4">
        <img
          src={track.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
          alt={`${track.title} by ${track.artist}`}
          className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
        
        <Button
          size="sm"
          className={`absolute bottom-2 right-2 w-10 h-10 bg-green-500 hover:bg-green-400 text-black rounded-full shadow-lg transition-all duration-300 ${
            isHovered || isCurrentTrack ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
        >
          <i className={`fas ${isCurrentTrack && isPlaying ? "fa-pause" : "fa-play"} text-sm`} />
        </Button>
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors truncate">
          {track.title}
        </h4>
        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {formatPlayCount(track.playCount || 0)} dinlenme
            </span>
            {track.platform && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-400">
                {track.platform}
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 rounded-full transition-colors ${
              track.isLiked ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-red-400"
            }`}
            onClick={handleLike}
            disabled={likeMutation.isPending}
          >
            <i className={`fas fa-heart text-sm ${track.isLiked ? "text-red-400" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
