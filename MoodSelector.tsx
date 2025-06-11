import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { MOODS } from '@/lib/constants';

interface MoodSelectorProps {
  selectedMood?: string;
  onMoodSelect: (mood: string) => void;
  className?: string;
  showLabel?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelect,
  className,
  showLabel = true
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  
  // Check if scroll buttons should be shown
  const checkScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Show left button if scrolled right
    setShowLeftScroll(scrollLeft > 0);
    
    // Show right button if there's more to scroll
    setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 10);
  };
  
  // Set up scroll checking
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      
      // Check on resize too
      window.addEventListener('resize', checkScroll);
      
      return () => {
        scrollElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);
  
  // Scroll functions
  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold">Ruh Haline Göre Keşfet</h2>
          <Button variant="link" className="text-xs text-primary p-0 h-auto flex items-center gap-1">
            <span>Tümünü Gör</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="relative">
        {/* Left scroll button */}
        {showLeftScroll && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full opacity-80 shadow-md" 
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Scrollable mood buttons */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto flex items-center gap-2 pb-2 -mx-1 px-1 scrollbar-none"
        >
          {MOODS.map((mood) => (
            <Button
              key={mood.id}
              variant={selectedMood === mood.id ? "default" : "secondary"}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium",
                selectedMood === mood.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-primary/10"
              )}
              onClick={() => onMoodSelect(mood.id)}
            >
              {mood.label}
            </Button>
          ))}
        </div>
        
        {/* Right scroll button */}
        {showRightScroll && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full opacity-80 shadow-md"
              onClick={scrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
