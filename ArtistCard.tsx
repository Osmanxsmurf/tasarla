import React from 'react';
import { cn } from '@/lib/utils';

interface ArtistCardProps {
  name: string;
  imageUrl: string;
  onClick?: () => void;
  className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  name,
  imageUrl,
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div 
      className={cn("text-center cursor-pointer", className)}
      onClick={handleClick}
    >
      <div className="w-full aspect-square rounded-full overflow-hidden mb-3 bg-secondary transition-transform hover:scale-105">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <h3 className="font-medium text-sm truncate">{name}</h3>
    </div>
  );
};
