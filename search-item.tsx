import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Music, User, Disc } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchItemProps {
  id: string;
  title: string;
  artist: string;
  type: "track" | "artist" | "album";
  thumbnail?: string;
  onClick: () => void;
  className?: string;
}

export function SearchItem({
  id,
  title,
  artist,
  type,
  thumbnail,
  onClick,
  className
}: SearchItemProps) {
  // Determine icon based on type
  const TypeIcon = () => {
    switch (type) {
      case "artist":
        return <User className="text-3xl text-light-300" />;
      case "album":
        return <Disc className="text-3xl text-light-300" />;
      case "track":
      default:
        return <Music className="text-3xl text-light-300" />;
    }
  };
  
  // Format subtitle based on type
  const getSubtitle = () => {
    switch (type) {
      case "artist":
        return "Artist";
      case "album":
        return `Album • ${artist}`;
      case "track":
      default:
        return artist;
    }
  };
  
  return (
    <div
      className={cn(
        "bg-dark-100 p-4 rounded-lg hover:bg-dark-100/80 transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-square bg-dark-200 rounded-md overflow-hidden flex items-center justify-center mb-3 relative group">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
          />
        ) : (
          <TypeIcon />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="default"
            size="icon"
            className="h-10 w-10 bg-primary hover:bg-primary/90 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Play className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <h3 className="font-medium text-light-100 truncate">{title}</h3>
      <p className="text-sm text-light-300 truncate">{getSubtitle()}</p>
    </div>
  );
}
