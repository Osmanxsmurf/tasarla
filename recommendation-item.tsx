import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationItemProps {
  id: string;
  title: string;
  artist: string;
  thumbnail?: string;
  onClick: () => void;
  className?: string;
}

export function RecommendationItem({
  id,
  title,
  artist,
  thumbnail,
  onClick,
  className
}: RecommendationItemProps) {
  return (
    <div
      className={cn(
        "bg-dark-200/50 p-3 rounded-lg flex items-center hover:bg-dark-200 transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-dark-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-light-300" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="overflow-hidden">
        <h4 className="font-medium truncate">{title}</h4>
        <p className="text-sm text-light-300 truncate">{artist}</p>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto text-light-300 hover:text-primary"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Play className="h-5 w-5" />
      </Button>
    </div>
  );
}
