import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isPlaying: boolean;
  bars?: number;
  height?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isPlaying, 
  bars = 20,
  height = 4
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [barHeights, setBarHeights] = useState<number[]>([]);
  
  // Initialize bar heights
  useEffect(() => {
    // Create a random array of heights for the bars
    const initialHeights = Array.from({ length: bars }, () => 
      Math.random() * 0.8 + 0.2
    );
    setBarHeights(initialHeights);
  }, [bars]);
  
  // Animate bar heights when playing
  useEffect(() => {
    let animationFrameId: number;
    
    if (isPlaying) {
      const animate = () => {
        // Update each bar with a slightly random height
        setBarHeights(prev => 
          prev.map(height => {
            // Add a small random adjustment, but keep within bounds
            const newHeight = height + (Math.random() * 0.4 - 0.2);
            return Math.max(0.2, Math.min(1, newHeight));
          })
        );
        
        animationFrameId = requestAnimationFrame(animate);
      };
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying]);
  
  return (
    <div className={`visualizer-container ${isPlaying ? 'playing' : ''} h-${height} flex items-end justify-between px-4 gap-0.5`}>
      {barHeights.map((height, index) => (
        <motion.div 
          key={index}
          className="visualizer-bar bg-primary h-full flex-1"
          animate={{ scaleY: isPlaying ? height : 0.1 }}
          transition={{ 
            duration: 0.2, 
            ease: "easeInOut",
            delay: index * 0.02 % 0.2 // Stagger effect
          }}
          style={{ 
            originY: "100%",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
