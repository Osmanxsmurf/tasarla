import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface MusicVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export function MusicVisualizer({ isPlaying, barCount = 20 }: MusicVisualizerProps) {
  const [heights, setHeights] = useState<number[]>([]);
  const requestRef = useRef<number>();
  
  // Generate random visualizer heights on component mount
  useEffect(() => {
    const newHeights = Array.from({ length: barCount }, () => Math.random() * 0.7 + 0.3);
    setHeights(newHeights);
  }, [barCount]);
  
  // Animate the visualizer when playing
  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }
    
    const updateHeights = () => {
      setHeights(prev => 
        prev.map(height => {
          // Gradually change the height for a smoother animation
          const change = (Math.random() - 0.5) * 0.2;
          const newHeight = Math.max(0.1, Math.min(1, height + change));
          return newHeight;
        })
      );
      requestRef.current = requestAnimationFrame(updateHeights);
    };
    
    requestRef.current = requestAnimationFrame(updateHeights);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className={cn("visualizer-container h-1 flex items-end justify-between px-4 gap-0.5 mb-1", {
      "playing": isPlaying
    })}>
      {heights.map((height, i) => (
        <div
          key={i}
          className="visualizer-bar bg-primary h-full flex-1"
          style={{
            transform: `scaleY(${isPlaying ? height : 0.1})`,
            animationDelay: `${0.05 * i}s`
          }}
        />
      ))}
    </div>
  );
}
