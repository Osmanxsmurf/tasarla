import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { MOODS } from '@/lib/constants';

interface MoodSelectorProps {
  onSelect?: (mood: string) => void;
  className?: string;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  onSelect,
  className
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [_, navigate] = useLocation();
  
  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
    
    if (onSelect) {
      onSelect(mood);
    } else {
      // If no onSelect prop, navigate to search with mood filter
      navigate(`/search?mood=${encodeURIComponent(mood)}`);
    }
  };
  
  return (
    <div className={`flex flex-wrap gap-2 ${className || ''}`}>
      {MOODS.map((mood) => (
        <Badge
          key={mood.id}
          variant={selectedMood === mood.id ? "default" : "secondary"}
          className={`px-3 py-1 cursor-pointer ${
            selectedMood === mood.id 
              ? "bg-primary bg-opacity-20 text-primary hover:bg-opacity-30" 
              : "hover:bg-opacity-80"
          }`}
          onClick={() => handleMoodClick(mood.id)}
        >
          {mood.label}
        </Badge>
      ))}
    </div>
  );
};
